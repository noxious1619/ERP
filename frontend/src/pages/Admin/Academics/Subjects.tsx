import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminNavbar from "../../../components/Admin/Navbar";
import SubjectsHeader from "../../../components/Admin/Academics/Subjects/SubjectsHeader";
import SubjectsStats from "../../../components/Admin/Academics/Subjects/SubjectsStats";
import SubjectsFilters from "../../../components/Admin/Academics/Subjects/SubjectsFilters";
import SubjectsTable from "../../../components/Admin/Academics/Subjects/SubjectsTable";
import SubjectsPagination from "../../../components/Admin/Academics/Subjects/SubjectsPagination";
import AddSubjectModal from "../../../components/Admin/Academics/Subjects/AddSubjectModal";
import ConfirmDeleteModal from "../../../components/Admin/Academics/Subjects/ConfirmDeleteModal";
import { API_BASE_URL } from "../../../lib/api";

export default function Subjects() {
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [isEditSubjectOpen, setIsEditSubjectOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<any | null>(null);

  // API State
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats State
  const [stats, setStats] = useState({ total: 0, theory: 0, lab: 0 });

  // Filters and Pagination State
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [selectedType, setSelectedType] = useState("All Type");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMatching, setTotalMatching] = useState(0);
  const limit = 6;

  // Checkbox Selections
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Dropdown lists
  const [classes, setClasses] = useState<any[]>([]);

  // Confirmation delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ── Fetch dynamic class options ──────────────────────────────────────────
  const fetchClasses = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${API_BASE_URL}/api/admin/subjects/classes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setClasses(res.data.data);
      }
    } catch (err: any) {
      console.error("Error fetching classes for filter:", err);
    }
  }, []);

  // ── Fetch subjects with query params ─────────────────────────────────────
  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const token = localStorage.getItem("token");

      const params: any = {
        page: currentPage,
        limit,
        search,
      };

      if (selectedClass !== "All Classes") {
        params.classId = selectedClass;
      }

      if (selectedType !== "All Type") {
        params.type = selectedType;
      }

      const res = await axios.get(`${API_BASE_URL}/api/admin/subjects`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      if (res.data.success) {
        setSubjects(res.data.data);
        setTotalMatching(res.data.pagination.total);
        setTotalPages(res.data.pagination.totalPages);
        setStats(res.data.stats);
      } else {
        setError("Failed to fetch subjects.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Error connecting to subjects server.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, search, selectedClass, selectedType]);

  // Fetch initial classes on mount
  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  // Fetch subjects whenever search, filters, or page change
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // Reset page to 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedClass, selectedType]);

  // Handle single row checkbox selection
  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = subjects.map((s) => s.id);
      setSelectedIds(allIds);
    } else {
      setSelectedIds([]);
    }
  };

  // Trigger edit popup
  const handleEditClick = () => {
    if (selectedIds.length !== 1) return;
    const idToEdit = selectedIds[0];
    const subj = subjects.find((s) => s.id === idToEdit);
    if (subj) {
      setSubjectToEdit(subj);
      setIsEditSubjectOpen(true);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${API_BASE_URL}/api/admin/subjects/bulk-delete`,
        { ids: selectedIds },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (res.data.success) {
        setSelectedIds([]);
        setIsDeleteModalOpen(false);
        fetchSubjects();
      } else {
        alert("Failed to delete subjects.");
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete subjects.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />
        <main className="flex-1 flex flex-col overflow-y-auto p-6">
          <div className="flex flex-col gap-4 max-w-10xl mx-auto w-full">
            {/* Header */}
            <SubjectsHeader
              search={search}
              onSearchChange={setSearch}
              onAddSubjectClick={() => setIsAddSubjectOpen(true)}
              totalMatching={totalMatching}
            />

            {/* Stats Cards */}
            <SubjectsStats stats={stats} />

            {/* Filters */}
            <SubjectsFilters
              selectedClass={selectedClass}
              onClassChange={setSelectedClass}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              classes={classes}
            />

            {error && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-2xl flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
                <span className="flex-1 leading-snug">{error}</span>
              </div>
            )}

            {/* Table Container (Scrollable) */}
            <div className="flex-1">
              <SubjectsTable
                subjects={subjects}
                selectedIds={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                onEditClick={handleEditClick}
                onDeleteClick={() => setIsDeleteModalOpen(true)}
                isLoading={isLoading}
              />
            </div>

            {/* Pagination */}
            <SubjectsPagination
              currentPage={currentPage}
              totalPages={totalPages}
              total={totalMatching}
              pageSize={limit}
              onPageChange={setCurrentPage}
            />
          </div>
        </main>
      </div>

      {/* Add Subject Modal */}
      <AddSubjectModal
        isOpen={isAddSubjectOpen}
        onClose={() => setIsAddSubjectOpen(false)}
        onSuccess={() => {
          setIsAddSubjectOpen(false);
          fetchSubjects();
        }}
        classes={classes}
      />

      {/* Edit Subject Modal */}
      <AddSubjectModal
        isOpen={isEditSubjectOpen}
        onClose={() => {
          setIsEditSubjectOpen(false);
          setSubjectToEdit(null);
          setSelectedIds([]);
        }}
        onSuccess={() => {
          setIsEditSubjectOpen(false);
          setSubjectToEdit(null);
          setSelectedIds([]);
          fetchSubjects();
        }}
        classes={classes}
        subjectToEdit={subjectToEdit}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        count={selectedIds.length}
      />
    </div>
  );
}
