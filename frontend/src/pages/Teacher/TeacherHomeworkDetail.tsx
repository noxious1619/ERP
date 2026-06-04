import { useState } from "react";
import { Download, ArrowLeft } from "lucide-react";
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import AssignmentInfoCard from "../../components/Teacher/Homework/ViewDetail/AssignmentInfoCard";
import AssignmentStatsCard from "../../components/Teacher/Homework/ViewDetail/AssignmentStatsCard";
import SearchBar from "../../components/Student/Dashboard/SearchBar";
import SubmissionFilterTabs from "../../components/Teacher/Homework/ViewDetail/SubmissionFilterTabs";
import SubmissionTable from "../../components/Teacher/Homework/ViewDetail/SubmissionTable";

const TeacherHomeworkDetail = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<
    "ALL" | "SUBMITTED" | "LATE" | "MISSING"
  >("ALL");

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto px-10 pt-4 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Reused header */}
        <HomeworkHeader />

        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 mb-4 mt-4 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Row 1: Info card + Stats card */}
        <div className="flex gap-5 mb-6">
          <AssignmentInfoCard />
          <AssignmentStatsCard />
        </div>

        {/* Row 2: Search + Export */}
        <div className="flex items-center gap-4 mb-5">
          <SearchBar
            placeholder="Search students..."
            value={search}
            onChange={setSearch}
          />
          <button className="h-[48px] px-6 rounded-full border border-[#EAECF0] bg-white shadow-sm text-[14px] font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors shrink-0">
            <Download className="w-4 h-4" />
            EXPORT
          </button>
        </div>

        {/* Row 3: Filter tabs */}
        <SubmissionFilterTabs active={activeTab} onChange={setActiveTab} />

        {/* Row 4: Table */}
        <SubmissionTable />
      </div>
    </div>
  );
};

export default TeacherHomeworkDetail;
