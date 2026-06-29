"use client";
import { useState, useEffect, useCallback } from "react";
import StaffHeader from "./StaffHeader";
import StaffFilters from "./StaffFilters";
import StaffStatsCards from "./StaffStatsCards";
import StaffTable, { type StaffType } from "./StaffTable";
import StaffPagination from "./StaffPagination";
import AddNewStaffModal from "./AddNewStaffModal";
import EditStaffModal from "./EditStaffModal";

const ITEMS_PER_PAGE = 10;

interface StaffMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  stats: {
    totalStaff: number;
    newThisMonth: number;
    active: number;
    onLeave: number;
  };
}

export default function StaffView() {
  const [staffList, setStaffList] = useState<StaffType[]>([]);
  const [meta, setMeta] = useState<StaffMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);

  // Delete confirmation state
  const [deletingStaff, setDeletingStaff] = useState<StaffType | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(ITEMS_PER_PAGE),
        ...(search && { search }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await fetch(`http://localhost:5000/api/staff?${params}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setStaffList(json.data);
      setMeta(json.meta);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
    }
  }, [currentPage, search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };
  const handleRoleChange = (val: string) => {
    setRoleFilter(val);
    setCurrentPage(1);
  };
  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleExportCSV = async () => {
    const params = new URLSearchParams({
      page: "1",
      limit: "9999",
      ...(search && { search }),
      ...(roleFilter && { role: roleFilter }),
      ...(statusFilter && { status: statusFilter }),
    });
    const res = await fetch(`http://localhost:5000/api/staff?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    const json = await res.json();
    if (!json.success) return;

    const headers = [
      "Employee ID,Name,Role,Department,Joining Date,Contact,Status",
    ];
    const rows = (json.data as StaffType[]).map(
      (s) =>
        `${s.employeeId},"${s.name}","${s.role}","${s.department}","${s.joiningDate}",${s.contact},${s.status}`,
    );
    const csv = headers.concat(rows).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Staff_List.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Edit handler ────────────────────────────────────────────────────────────
  const handleEdit = (staff: StaffType) => {
    setEditingStaff(staff);
    setIsEditModalOpen(true);
  };

  // ── Delete handler ──────────────────────────────────────────────────────────
  const handleDeleteConfirm = async () => {
    if (!deletingStaff) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/staff/${deletingStaff.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      setDeleteSuccess(true);
      setTimeout(() => {
        setDeleteSuccess(false);
        setDeletingStaff(null);
        fetchStaff();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setDeletingStaff(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden gap-5 h-full">
      <StaffHeader
        totalCount={meta?.total ?? 0}
        search={search}
        onSearchChange={handleSearch}
        onAddClick={() => setIsAddModalOpen(true)}
        onExportCSV={handleExportCSV}
      />
      <StaffFilters
        onRoleChange={handleRoleChange}
        onStatusChange={handleStatusChange}
      />
      <StaffStatsCards stats={meta?.stats ?? null} loading={loading} />

      <div className="flex-1 overflow-y-auto min-h-0">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <StaffTable
            staffList={staffList}
            loading={isInitialLoad}
            onEdit={handleEdit}
            onDelete={(staff) => setDeletingStaff(staff)}
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

      {/* Delete confirmation dialog */}
      {deletingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4">
          <div
            className="absolute inset-0"
            onClick={() => !deleteLoading && setDeletingStaff(null)}
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
                  Staff member deleted successfully
                </p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#0a1c3a]">
                    Delete Staff Member
                  </h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete{" "}
                    <span className="font-semibold text-gray-800">
                      {deletingStaff.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>

                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                  This will permanently remove the staff record and their login
                  access.
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setDeletingStaff(null)}
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

      <AddNewStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => {
          setCurrentPage(1);
          fetchStaff();
        }}
      />

      <EditStaffModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStaff(null);
        }}
        onSuccess={() => {
          setCurrentPage(1);
          fetchStaff();
        }}
        staffId={editingStaff?.id ?? null}
      />
    </div>
  );
}
