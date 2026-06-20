import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Download, ArrowLeft, Loader2 } from "lucide-react"; 
import Navbar from "../../components/Teacher/Dashboard/Navbar";
import HomeworkHeader from "../../components/Student/Homework/HomeworkHeader";
import AssignmentInfoCard from "../../components/Teacher/Homework/ViewDetail/AssignmentInfoCard";
import AssignmentStatsCard from "../../components/Teacher/Homework/ViewDetail/AssignmentStatsCard";
import SearchBar from "../../components/Student/Dashboard/SearchBar";
import SubmissionFilterTabs from "../../components/Teacher/Homework/ViewDetail/SubmissionFilterTabs";
import SubmissionTable from "../../components/Teacher/Homework/ViewDetail/SubmissionTable";
import { useSubmissionList } from "../../hooks/useSubmissionList"; 

const TeacherHomeworkDetail = () => {
  // 1. Grab the assignment ID from the router URL
  const { id: assignmentId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 2. State for filters and pagination
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"ALL" | "SUBMITTED" | "LATE" | "MISSING">("ALL");
  const [page, setPage] = useState(1);

  // 3. Fetch the data using our new hook!
  const { data, pagination, loading, error } = useSubmissionList({
    assignmentId: assignmentId || "",
    search,
    status: activeTab,
    page,
  });

  console.log("1. URL Param (assignmentId):", assignmentId);
  console.log("2. Hook Output Data:", data);
  console.log("3. Hook Output Status:", { loading, error });

  // 4. Handlers to ensure we go back to page 1 when filtering
  const handleTabChange = (tab: "ALL" | "SUBMITTED" | "LATE" | "MISSING") => {
    setActiveTab(tab);
    setPage(1);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FE]">
      <Navbar />

      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-y-auto px-10 pt-4 pb-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <HomeworkHeader />

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-[13px] text-gray-500 hover:text-gray-700 mb-4 mt-4 w-fit cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Graceful Loading & Error States */}
        {error ? (
          <div className="flex-1 flex items-center justify-center text-[#A8364B] bg-white rounded-[20px] border border-[#EAECF0] shadow-sm">
            <p>{error}</p>
          </div>
        ) : loading && !data ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 h-full">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#4D8DFF]" />
            <p className="text-[14px] font-medium text-gray-500">Loading assignment details...</p>
          </div>
        ) : (
          <>
            {/* Row 1: Info card + Stats card */}
            <div className="flex gap-5 mb-6">
              <AssignmentInfoCard info={data?.assignmentInfo} />
              <AssignmentStatsCard stats={data?.stats} />
            </div>

            {/* Row 2: Search + Export */}
            <div className="flex items-center gap-4 mb-5">
              <SearchBar
                placeholder="Search students..."
                value={search}
                onChange={handleSearch}
              />
              <button className="h-[48px] px-6 rounded-full border border-[#EAECF0] bg-white shadow-sm text-[14px] font-semibold text-gray-700 flex items-center gap-2 hover:bg-gray-50 transition-colors shrink-0 cursor-pointer">
                <Download className="w-4 h-4" />
                EXPORT
              </button>
            </div>

            {/* Row 3: Filter tabs */}
            <SubmissionFilterTabs active={activeTab} onChange={handleTabChange} />

            {/* Row 4: Table */}
            <SubmissionTable 
              submissions={data?.submissions || []} 
              pagination={pagination}
              onPageChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherHomeworkDetail;