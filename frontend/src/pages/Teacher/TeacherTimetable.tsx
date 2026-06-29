import { useState, useEffect } from "react";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import TeacherNavbar from "../../components/Teacher/Dashboard/Navbar";
import CalendarSection from "../../components/Student/Dashboard/Calendar";
import TeacherDateScheduleCard from "../../components/Teacher/Timetable/TeacherDateScheduleCard";
import TeacherTimetableHeader, {
  type TeacherFilterMode,
  type TeacherSection,
} from "../../components/Teacher/Timetable/TeacherTimetableHeader";
import TeacherTimetableSchedule from "../../components/Teacher/Timetable/Teachertimetableschedule";
import { getCurrentAPIDay } from "../../utils/dateHelpers";

// ─── Types ────────────────────────────────────────────────────────────────────
interface MySubjectApiItem {
  id: string;
  time: string;
  isActive: boolean;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject: string | null;
  professor: string | null;
  duration?: string;
}

interface ClassDailyItem {
  id: string;
  time: string;
  isActive: boolean;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject: string | null;
  professor: string | null;
  duration?: string;
}

interface WeeklyTimetableEntry {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  isBreak: boolean;
  breakLabel: string | null;
  room: string | null;
  color: string | null;
  subject?: { id: string; name: string; code: string } | null;
  teacher?: { id: string; firstName: string; lastName: string } | null;
  displayTeacherName?: string | null;
}

interface MySubjectWeeklyEntry {
  id: string;
  day: string;
  time: string; // Used in your custom teacher controller
  endTime: string;
  room: string;
  color: string;
  subject: string; 
  code: string;
  sectionLabel: string;
}

const TeacherTimetablePage = () => {
  const [filterMode, setFilterMode] = useState<TeacherFilterMode>("class");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // ✅ Extract teacherData from auth context
  const { teacherData } = useAuth(); 

  // ─── Sections from teacher profile ───────────────────────────────────────
  const [teacherSections, setTeacherSections] = useState<TeacherSection[]>([]);
  const [selectedSection, setSelectedSection] = useState<TeacherSection | null>(null);
  const [teacherName, setTeacherName] = useState("");

  // ─── Class-wise daily data (left schedule cards) ──────────────────────────
  const [classItems, setClassItems] = useState<ClassDailyItem[]>([]);
  const [classLoading, setClassLoading] = useState(false);
  const [classError, setClassError] = useState<string | null>(null);

  // ─── Class-wise FULL WEEK data (for right panel calendar filter) ──────────
  const [classWeeklyData, setClassWeeklyData] = useState<WeeklyTimetableEntry[]>([]);
  const [classWeeklyLoading, setClassWeeklyLoading] = useState(false);

  // ─── My Subject daily data (left schedule cards) ─────────────────────────
  const [mySubjectItems, setMySubjectItems] = useState<MySubjectApiItem[]>([]);
  const [mySubjectLoading, setMySubjectLoading] = useState(false);
  const [mySubjectError, setMySubjectError] = useState<string | null>(null);

  // ─── My Subject FULL WEEK data (for right panel calendar filter) ──────────
  const [mySubjectWeeklyData, setMySubjectWeeklyData] = useState<MySubjectWeeklyEntry[]>([]);
  const [mySubjectWeeklyLoading, setMySubjectWeeklyLoading] = useState(false);
  
  const ACTIVE_DAY = getCurrentAPIDay();

  // ─── 1. Initialize Profile State from useAuth (NO API CALL NEEDED) ────────
  useEffect(() => {
    if (teacherData && teacherData.teachingAssignments) {
      // Set Teacher Name
      setTeacherName(`${teacherData.firstName} ${teacherData.lastName}`.trim());

      // Extract sections from teaching assignments safely
      const mappedSections = teacherData.teachingAssignments.map((assignment: any) => ({
        id: assignment.section.id,
        name: assignment.section.name,
        academicClass: {
          id: assignment.section.academicClass.id,
          name: assignment.section.academicClass.name,
        }
      }));

      // Remove duplicates (in case teacher teaches 2 subjects in the same section)
      const uniqueSections = Array.from(
        new Map(mappedSections.map((item: TeacherSection) => [item.id, item])).values()
      ) as TeacherSection[];

      setTeacherSections(uniqueSections);
      
      // Auto-select the first section if one isn't selected yet
      if (uniqueSections.length > 0 && !selectedSection) {
        setSelectedSection(uniqueSections[0]);
      }
    }
  }, [teacherData]);

  // ─── 2. Fetch class-wise DAILY (left cards) ───────────────────────────────
  useEffect(() => {
    if (!selectedSection || filterMode !== "class") return;
    const fetchClassDaily = async () => {
      try {
        setClassLoading(true);
        setClassError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/timetable/section/${selectedSection.id}/daily`,
          {
            params: { day: ACTIVE_DAY },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) setClassItems(response.data.data);
        else setClassError("Failed to load timetable.");
      } catch (err: any) {
        setClassError(err.response?.data?.message || "Error connecting to server.");
      } finally {
        setClassLoading(false);
      }
    };
    fetchClassDaily();
  }, [selectedSection, filterMode, ACTIVE_DAY]);

  // ─── 3. Fetch class-wise FULL WEEK (right panel) ──────────────────────────
  useEffect(() => {
    if (!selectedSection) return;
    const fetchClassWeekly = async () => {
      try {
        setClassWeeklyLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/timetable/section/${selectedSection.id}/weekly`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) setClassWeeklyData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch class weekly data", err);
      } finally {
        setClassWeeklyLoading(false);
      }
    };
    fetchClassWeekly();
  }, [selectedSection]);

  // ─── 4. Fetch My Subject DAILY (left cards) ───────────────────────────────
  useEffect(() => {
    if (filterMode !== "mySubject" || !teacherData?.id) return;
    const fetchMySubjectDaily = async () => {
      try {
        setMySubjectLoading(true);
        setMySubjectError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/timetable/teacher/${teacherData.id}/daily`,
          {
            params: { day: ACTIVE_DAY, filter: "mySubject" },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data.success) setMySubjectItems(response.data.data);
        else setMySubjectError("Failed to load timetable.");
      } catch (err: any) {
        setMySubjectError(err.response?.data?.message || "Error connecting to server.");
      } finally {
        setMySubjectLoading(false);
      }
    };
    fetchMySubjectDaily();
  }, [filterMode, teacherData?.id, ACTIVE_DAY]);

  // ─── 5. Fetch My Subject FULL WEEK (right panel) ─────────────────────────
  useEffect(() => {
    if (filterMode !== "mySubject" || !teacherData?.id) return;
    const fetchMySubjectWeekly = async () => {
      try {
        setMySubjectWeeklyLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/timetable/teacher/${teacherData.id}/weekly`,
          { 
            params: { filter: "mySubject" },
            headers: { Authorization: `Bearer ${token}` } 
          }
        );
        if (response.data.success) setMySubjectWeeklyData(response.data.data);
      } catch (err) {
        console.error("Failed to fetch my subject weekly data", err);
      } finally {
        setMySubjectWeeklyLoading(false);
      }
    };
    fetchMySubjectWeekly();
  }, [filterMode, teacherData?.id]);

  const sectionLabel = selectedSection
    ? `${selectedSection.academicClass.name} - ${selectedSection.name}`
    : "";

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <TeacherNavbar />
      <div className="flex flex-1 flex-col h-screen min-w-0">
        {/* Sticky Header */}
        <div className="px-10 pt-8 py-4 shrink-0 bg-[#F5F6FA]">
          <TeacherTimetableHeader
            filterMode={filterMode}
            onFilterChange={setFilterMode}
            sections={teacherSections}
            selectedSection={selectedSection}
            onSectionChange={setSelectedSection}
          />
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Schedule Cards */}
          <div className="flex-1 overflow-y-auto px-10 py-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TeacherTimetableSchedule
              filterMode={filterMode}
              classItems={classItems}
              classLoading={classLoading}
              classError={classError}
              mySubjectItems={mySubjectItems}
              mySubjectLoading={mySubjectLoading}
              mySubjectError={mySubjectError}
            />
          </div>

          {/* Right Panel */}
          <div className="w-90 shrink-0 bg-gray-100 px-3 py-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <CalendarSection
              variant="timetable"
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
            <TeacherDateScheduleCard
              filterMode={filterMode}
              selectedDate={selectedDate}
              classWeeklyData={classWeeklyData}
              classWeeklyLoading={classWeeklyLoading}
              mySubjectWeeklyData={mySubjectWeeklyData}
              mySubjectWeeklyLoading={mySubjectWeeklyLoading}
              teacherName={teacherName}
              sectionLabel={sectionLabel}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherTimetablePage;