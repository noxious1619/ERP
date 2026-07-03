"use client";
import { useState, useEffect, useCallback } from "react";
import TeacherHeader from "./TeacherHeader";
import TeacherFilters from "./TeacherFilters";
import TeacherStatsCards from "./TeacherStatsCards";
import TeacherTable, { type TeacherRowType } from "./TeacherTable";
import StaffPagination from "../Staff/StaffPagination";
import AddNewTeacherModal from "./AddNewTeacherModal";
import EditTeacherModal from "./EditTeacherModal";
import { API_BASE_URL } from "../../../../lib/api";

const ITEMS_PER_PAGE = 10;

interface TeacherMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalTeachers: number;
    newThisMonth: number;
    active: number;
    onLeave: number;
  };
}

export default function TeacherView() {
  const [teacherList, setTeacherList] = useState<TeacherRowType[]>([]);
  const [meta, setMeta] = useState<TeacherMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherRowType | null>(
    null,
  );

  // Delete state
  const [deletingTeacher, setDeletingTeacher] = useState<TeacherRowType[]>([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchTeachers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(genderFilter && { gender: genderFilter }),
        ...(classFilter && { classId: classFilter }),
        ...(subjectFilter && { subjectId: subjectFilter }),
      });

      const res = await fetch(`${API_BASE_URL}/api/teachers?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setTeacherList(json.data);
      setMeta(json.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [
    currentPage,
    search,
    statusFilter,
    genderFilter,
    classFilter,
    subjectFilter,
  ]);

  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };
  const handleGenderChange = (val: string) => {
    setGenderFilter(val);
    setCurrentPage(1);
  };
  const handleClassChange = (val: string) => {
    setClassFilter(val);
    setCurrentPage(1);
  };
  const handleSubjectChange = (val: string) => {
    setSubjectFilter(val);
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    const params = new URLSearchParams({
      page: "1",
      limit: "9999",
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(genderFilter && { gender: genderFilter }),
      ...(classFilter && { classId: classFilter }),
      ...(subjectFilter && { subjectId: subjectFilter }),
    });
    const res = await fetch(`${API_BASE_URL}/api/teachers?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const json = await res.json();
    if (!json.success) return;

    const headers = [
      "Employee ID,Name,Subject,Sections,Qualification,Contact,Status",
    ];
    const rows = (json.data as TeacherRowType[]).map(
      (t) =>
        `${t.employeeId},"${t.name}","${t.subject}","${t.sections.join("; ")}","${t.qualification}",${t.contact},${t.status}`,
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Teachers_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEdit = (teacher: TeacherRowType) => {
    setEditingTeacher(teacher);
    setIsEditModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deletingTeacher.length === 0) return;

    setDeleteLoading(true);

    try {
      const isSingle = deletingTeacher.length === 1;

      if (isSingle) {
        const res = await fetch(
          `${API_BASE_URL}/api/teachers/${deletingTeacher[0].id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          },
        );

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message);
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/api/teachers/bulk-delete`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ids: deletingTeacher.map((teacher) => teacher.id),
          }),
        });

        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message);
        }
      }

      setDeleteSuccess(true);

      setTimeout(() => {
        setDeleteSuccess(false);
        setDeletingTeacher([]);
        fetchTeachers();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setDeletingTeacher([]);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <TeacherHeader
        totalCount={meta?.total ?? 0}
        search={search}
        onSearchChange={handleSearch}
        onAddClick={() => setIsAddModalOpen(true)}
        onExportCSV={handleExportCSV}
      />
      <TeacherFilters
        onStatusChange={handleStatusChange}
        onGenderChange={handleGenderChange}
        onClassChange={handleClassChange}
        onSubjectChange={handleSubjectChange}
      />
      <TeacherStatsCards stats={meta?.stats ?? null} loading={loading} />

      <div className="flex-1 min-h-[430px] overflow-hidden">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <TeacherTable
            teacherList={teacherList}
            loading={isInitialLoad}
            onEdit={handleEdit}
            onDelete={(teachers) => setDeletingTeacher(teachers)}
          />
        )}
      </div>

      {meta && (
        <StaffPagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          onPageChange={setCurrentPage}
          startIndex={(currentPage - 1) * ITEMS_PER_PAGE}
          endIndex={Math.min(currentPage * ITEMS_PER_PAGE, meta.total)}
        />
      )}

      {/* Delete confirmation */}
      {deletingTeacher.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => !deleteLoading && setDeletingTeacher([])}
          />
          <div className="relative w-full max-w-md rounded-[24px] bg-white shadow-2xl z-10 p-6 flex flex-col gap-4">
            {deleteSuccess ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-800">
                  {deletingTeacher.length === 1
                    ? "Teacher deleted successfully"
                    : `${deletingTeacher.length} teachers deleted successfully`}
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#0a1c3a]">
                    Delete Teacher
                  </h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    {deletingTeacher.length === 1 ? (
                      <span className="font-semibold text-gray-800">
                        {deletingTeacher[0].name}
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-800">
                        {deletingTeacher.length} teachers
                      </span>
                    )}
                    ? This action cannot be undone.
                  </p>
                </div>
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  This will permanently remove the teacher, their assignments,
                  and login access.
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setDeletingTeacher([])}
                    disabled={deleteLoading}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleteLoading}
                    className="flex-1 rounded-2xl bg-red-500 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {deleteLoading ? (
                      <>
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <AddNewTeacherModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setCurrentPage(1);
          fetchTeachers();
        }}
      />

      <EditTeacherModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingTeacher(null);
        }}
        onSuccess={() => {
          setCurrentPage(1);
          fetchTeachers();
        }}
        teacherId={editingTeacher?.id ?? null}
      />
    </div>
  );
}
