"use client"

import { useState, useMemo } from "react"
import StaffHeader from "./StaffHeader"
import StaffFilters from "./StaffFilters"
import StaffStatsCards from "./StaffStatsCards"
import StaffTable, { type StaffType } from "./StaffTable"
import StaffPagination from "./StaffPagination"
import AddNewStaffModal from "./AddNewStaffModal"

// Extended Mock Data for Pagination and Filtering
const MOCK_STAFF: StaffType[] = [
  { id: "EMP001", name: "Dr. Rajesh Kumar", role: "Principal", subject: "-", assigned: ["All Classes"], contact: "98765 43210", status: "Active" },
  { id: "EMP002", name: "Mrs. Priya Sharma", role: "Teacher", subject: "English", assigned: ["10A", "9B", "7C"], contact: "88755 87241", status: "Active" },
  { id: "EMP003", name: "Mr. Amit Patel", role: "Accountant", subject: "-", assigned: ["-"], contact: "82765 83254", status: "Active" },
  { id: "EMP004", name: "Ms. Sneha Reddy", role: "Teacher", subject: "Physics", assigned: ["11A", "12B"], contact: "76765 03202", status: "Active" },
  { id: "EMP005", name: "Mr. Vikram Singh", role: "Front Desk", subject: "-", assigned: ["-"], contact: "62765 83234", status: "Active" },
  { id: "EMP006", name: "Dr. Anjali Verma", role: "Teacher", subject: "Math", assigned: ["10A", "11A", "12A"], contact: "96765 07252", status: "On Leave" },
  { id: "EMP007", name: "Mr. Suresh Nair", role: "Teacher", subject: "Chemistry", assigned: ["9A", "10B"], contact: "98765 11111", status: "Active" },
  { id: "EMP008", name: "Ms. Kavita Desai", role: "Teacher", subject: "Biology", assigned: ["11B", "12C"], contact: "98765 22222", status: "Active" },
  { id: "EMP009", name: "Mr. Rahul Gupta", role: "Accountant", subject: "-", assigned: ["-"], contact: "98765 33333", status: "On Leave" },
  { id: "EMP010", name: "Mrs. Neha Singh", role: "Front Desk", subject: "-", assigned: ["-"], contact: "98765 44444", status: "Active" },
  { id: "EMP011", name: "Dr. Pankaj Mishra", role: "Teacher", subject: "History", assigned: ["8A", "9C", "10C"], contact: "98765 55555", status: "Active" },
  { id: "EMP012", name: "Ms. Ritu Sharma", role: "Teacher", subject: "Geography", assigned: ["6A", "7B"], contact: "98765 66666", status: "Active" },
  { id: "EMP013", name: "Mr. Sanjay Dutt", role: "Accountant", subject: "-", assigned: ["-"], contact: "98765 77777", status: "Active" },
  { id: "EMP014", name: "Mrs. Pooja Jain", role: "Teacher", subject: "Computer Science", assigned: ["10A", "11A", "12A"], contact: "98765 88888", status: "On Leave" },
]

export default function StaffView() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const ITEMS_PER_PAGE = 6

  // Filtering Logic
  const filteredStaff = useMemo(() => {
    return MOCK_STAFF.filter((staff) => {
      // Search matching across multiple fields
      const matchesSearch = search === "" || 
        staff.name.toLowerCase().includes(search.toLowerCase()) || 
        staff.id.toLowerCase().includes(search.toLowerCase()) || 
        staff.contact.includes(search) ||
        staff.subject.toLowerCase().includes(search.toLowerCase()) ||
        staff.role.toLowerCase().includes(search.toLowerCase());

      const matchesRole = roleFilter === "" || staff.role === roleFilter;
      const matchesStatus = statusFilter === "" || staff.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, roleFilter, statusFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredStaff.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStaffList = filteredStaff.slice(startIndex, endIndex);

  // Helper handling filter change sets page to 1
  const handleSearch = (val: string) => { setSearch(val); setCurrentPage(1); }
  const handleRoleChange = (val: string) => { setRoleFilter(val); setCurrentPage(1); }
  const handleStatusChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); }

  // Export CSV Functionality
  const handleExportCSV = () => {
    const headers = ["Employee ID,Name,Role,Subject,Assigned,Contact,Status"];
    const rows = filteredStaff.map(staff => 
      `${staff.id},"${staff.name}","${staff.role}","${staff.subject}","${staff.assigned.join('; ')}",${staff.contact},${staff.status}`
    );
    const csvContent = headers.concat(rows).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "Staff_List.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        <StaffHeader 
          totalCount={filteredStaff.length}
          search={search}
          onSearchChange={handleSearch}
          onAddClick={() => setIsModalOpen(true)}
          onExportCSV={handleExportCSV}
        />
        <StaffFilters 
          onRoleChange={handleRoleChange}
          onStatusChange={handleStatusChange}
        />
        <StaffStatsCards />
        <StaffTable staffList={currentStaffList} />
        <StaffPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredStaff.length}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>

      <AddNewStaffModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}