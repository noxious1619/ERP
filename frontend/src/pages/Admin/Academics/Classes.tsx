import { useState, useEffect } from "react";
import { Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminNavbar from "../../../components/Admin/Navbar";
import ClassesHeader from "../../../components/Admin/Academics/Classes & Sections/ClassesHeader";
import ClassesBanner from "../../../components/Admin/Academics/Classes & Sections/ClassesBanner";
import SectionCard from "../../../components/Admin/Academics/Classes & Sections/SectionCard";
import AddClassModal from "../../../components/Admin/Academics/Classes & Sections/AddClassModal";
import AddSectionModal from "../../../components/Admin/Academics/Classes & Sections/AddSectionModal";
import { API_BASE_URL } from "../../../lib/api";

interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
}

interface AcademicClass {
  id: string;
  name: string;
  academicYearId: string;
}

interface Section {
  id: string;
  name: string;
  homeRoom: string | null;
  capacity: number;
  classTeacherId: string | null;
  classTeacherName: string;
  studentCount: number;
}

export default function Classes() {
  const [isAddClassOpen, setIsAddClassOpen] = useState(false);
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editSection, setEditSection] = useState<Section | null>(null);

  // Delete section state
  const [deleteSection, setDeleteSection] = useState<Section | null>(null);
  const [deleteSectionLoading, setDeleteSectionLoading] = useState(false);
  const [deleteSectionError, setDeleteSectionError] = useState<string | null>(
    null,
  );
  const [deleteSectionSuccess, setDeleteSectionSuccess] = useState(false);

  // Delete class state
  const [showDeleteClass, setShowDeleteClass] = useState(false);
  const [deleteClassLoading, setDeleteClassLoading] = useState(false);
  const [deleteClassError, setDeleteClassError] = useState<string | null>(null);
  const [deleteClassSuccess, setDeleteClassSuccess] = useState(false);

  const [years, setYears] = useState<AcademicYear[]>([]);
  const [classes, setClasses] = useState<AcademicClass[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedYearId, setSelectedYearId] = useState<string | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingSections, setLoadingSections] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/academic/years`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const yearList: AcademicYear[] = data ?? [];
        setYears(yearList);
        const current = yearList.find((y) => y.isCurrent) ?? yearList[0];
        if (current) setSelectedYearId(current.id);
      } catch (err) {
        console.error("Failed to fetch years", err);
      } finally {
        setLoadingYears(false);
      }
    };
    fetchYears();
  }, []);

  const fetchClasses = async (yearId: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/academic/classes?yearId=${yearId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      const classList: AcademicClass[] = data.data ?? [];
      setClasses(classList);
      if (classList.length > 0) {
        setSelectedClassId(classList[0].id);
      } else {
        setSelectedClassId(null);
        setSections([]);
      }
    } catch (err) {
      console.error("Failed to fetch classes", err);
    }
  };

  useEffect(() => {
    if (!selectedYearId) return;
    fetchClasses(selectedYearId);
  }, [selectedYearId]);

  const fetchSections = async () => {
    if (!selectedClassId) return;
    setLoadingSections(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/academic/sections?classId=${selectedClassId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      setSections(data.data ?? []);
    } catch (err) {
      console.error("Failed to fetch sections", err);
    } finally {
      setLoadingSections(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [selectedClassId]);

  // Delete section handler
  const handleDeleteSectionConfirm = async () => {
    if (!deleteSection) return;
    setDeleteSectionLoading(true);
    setDeleteSectionError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/academic/sections/${deleteSection.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setDeleteSectionError(data.message);
        return;
      }
      setDeleteSectionSuccess(true);
      fetchSections();
      setTimeout(() => {
        setDeleteSection(null);
        setDeleteSectionSuccess(false);
        setDeleteSectionError(null);
      }, 1200);
    } catch (err) {
      setDeleteSectionError("Something went wrong. Please try again.");
    } finally {
      setDeleteSectionLoading(false);
    }
  };

  // Delete class handler
  const handleDeleteClassConfirm = async () => {
    if (!selectedClassId) return;
    setDeleteClassLoading(true);
    setDeleteClassError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/academic/classes/${selectedClassId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const data = await res.json();
      if (!res.ok) {
        setDeleteClassError(data.message);
        return;
      }
      setDeleteClassSuccess(true);
      setTimeout(() => {
        setShowDeleteClass(false);
        setDeleteClassSuccess(false);
        setDeleteClassError(null);
        // Refetch classes and auto-select first remaining
        if (selectedYearId) fetchClasses(selectedYearId);
      }, 1200);
    } catch (err) {
      setDeleteClassError("Something went wrong. Please try again.");
    } finally {
      setDeleteClassLoading(false);
    }
  };

  const selectedClass = classes.find((c) => c.id === selectedClassId);
  const totalStudents = sections.reduce((sum, s) => sum + s.studentCount, 0);
  const totalCapacity = sections.reduce((sum, s) => sum + s.capacity, 0);

  if (loadingYears) {
    return (
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AdminNavbar />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-400 text-sm">Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 flex flex-col overflow-hidden p-6">
          <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full h-full">
            <ClassesHeader
              years={years}
              classes={classes}
              selectedYearId={selectedYearId}
              selectedClassId={selectedClassId}
              onYearChange={(yearId) => {
                setSelectedYearId(yearId);
                setSelectedClassId(null);
                setSections([]);
              }}
              onClassChange={(classId) => setSelectedClassId(classId)}
            />
            <ClassesBanner
              className={selectedClass?.name ?? ""}
              totalStudents={totalStudents}
              totalCapacity={totalCapacity}
              sectionCount={sections.length}
              hasSelectedClass={!!selectedClass}
              onAddClassClick={() => setIsAddClassOpen(true)}
              onAddSectionClick={() => {
                setEditSection(null);
                setIsAddSectionOpen(true);
              }}
              onDeleteClassClick={() => {
                setDeleteClassError(null);
                setDeleteClassSuccess(false);
                setShowDeleteClass(true);
              }}
            />

            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
              {loadingSections ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-400 text-sm">Loading sections...</p>
                </div>
              ) : sections.length === 0 ? (
                <div className="flex items-center justify-center h-40">
                  <p className="text-gray-400 text-sm">
                    No sections found. Click "+ Add Section" to create one.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 pb-4">
                  {sections.map((section) => (
                    <SectionCard
                      key={section.id}
                      id={section.id}
                      sectionName={section.name}
                      teacherName={section.classTeacherName}
                      roomNumber={section.homeRoom ?? "Not Assigned"}
                      strength={section.studentCount}
                      maxStrength={section.capacity}
                      onEdit={() => {
                        setEditSection(section);
                        setIsAddSectionOpen(true);
                      }}
                      onDelete={() => {
                        setDeleteSection(section);
                        setDeleteSectionError(null);
                        setDeleteSectionSuccess(false);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add / Edit Section Modal */}
      <AddSectionModal
        isOpen={isAddSectionOpen}
        onClose={() => {
          setIsAddSectionOpen(false);
          setEditSection(null);
        }}
        classId={selectedClassId}
        onSuccess={fetchSections}
        editData={editSection}
      />

      {/* Add Class Modal */}
      <AddClassModal
        isOpen={isAddClassOpen}
        onClose={() => setIsAddClassOpen(false)}
        yearId={selectedYearId}
        onSuccess={() => {
          if (selectedYearId) fetchClasses(selectedYearId);
        }}
      />

      {/* Delete Section — inline modal */}
      {deleteSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!deleteSectionLoading) setDeleteSection(null);
            }}
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-[#f8fafd] p-6 shadow-2xl z-10 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a1c3a]">
                  Delete Section
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    "{deleteSection.name}"
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>

            {deleteSectionSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                Section deleted successfully!
              </div>
            )}

            {deleteSectionError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                {deleteSectionError}
              </div>
            )}

            {!deleteSectionSuccess && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setDeleteSection(null);
                    setDeleteSectionError(null);
                  }}
                  disabled={deleteSectionLoading}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSectionConfirm}
                  disabled={deleteSectionLoading}
                  className="flex-1 rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {deleteSectionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Class — inline modal */}
      {showDeleteClass && selectedClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => {
              if (!deleteClassLoading) setShowDeleteClass(false);
            }}
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-[#f8fafd] p-6 shadow-2xl z-10 flex flex-col gap-5">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-red-50 flex items-center justify-center">
                <Trash2 className="h-7 w-7 text-red-500" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a1c3a]">
                  Delete Class
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-gray-700">
                    "{selectedClass.name}"
                  </span>
                  ? All its sections will also be deleted. This action cannot be
                  undone.
                </p>
              </div>
            </div>

            {deleteClassSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                Class deleted successfully!
              </div>
            )}

            {deleteClassError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                {deleteClassError}
              </div>
            )}

            {!deleteClassSuccess && (
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteClass(false);
                    setDeleteClassError(null);
                  }}
                  disabled={deleteClassLoading}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-60"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteClassConfirm}
                  disabled={deleteClassLoading}
                  className="flex-1 rounded-2xl bg-red-500 py-3.5 text-sm font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60"
                >
                  {deleteClassLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
