"use client"

import { useState, useCallback, useEffect } from "react"
import axios from "axios"
import StudentsHeader from "./StudentHeader"
import StudentFilters from "./StudentFilters"
import StudentStatsCards from "./StudentStatsCards"
import StudentTable from "./StudentTable"
import StudentPagination from "./StudentPagination"
import AddNewStudentModal from "./AddNewStudentModal"
import ConfirmDeleteStudentModal from "./ConfirmDeleteStudentModal"
import { useStudents } from "../../../hooks/useStudents"

const PAGE_SIZE = 6
const API_BASE = "http://localhost:5000"

export default function StudentsView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [studentToEdit, setStudentToEdit] = useState<any | null>(null)

  // Dropdowns metadata
  const [classes, setClasses] = useState<any[]>([])
  const [sections, setSections] = useState<any[]>([])
  const [years, setYears] = useState<string[]>([])

  // Filters state
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  // Checkbox selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const {
    students,
    pagination,
    loading,
    error,
    refetch,
    stats,
  } = useStudents({
    search,
    page,
    limit: PAGE_SIZE,
    classId: selectedClass,
    sectionId: selectedSection,
    gender: selectedGender,
    status: selectedStatus,
    year: selectedYear,
  })

  // Fetch classes and academic years on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { Authorization: `Bearer ${token}` }

        // Fetch classes
        const classRes = await axios.get(`${API_BASE}/api/admin/subjects/classes`, { headers })
        if (classRes.data.success) {
          setClasses(classRes.data.data)
        }

        // Fetch academic years
        const yearRes = await axios.get(`${API_BASE}/api/academic/years`, { headers })
        if (Array.isArray(yearRes.data)) {
          // Extract year prefixes like "2026" from "2026-2027"
          const yearNames = yearRes.data.map((y: any) => y.name.split("-")[0])
          setYears(Array.from(new Set(yearNames)))
        }
      } catch (err) {
        console.error("Error fetching filter metadata:", err)
      }
    }
    fetchMetadata()
  }, [])

  // Fetch sections when class filter changes
  useEffect(() => {
    if (!selectedClass) {
      setSections([])
      setSelectedSection("")
      return
    }

    const fetchSections = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await axios.get(`${API_BASE}/api/admin/subjects/classes/${selectedClass}/sections`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.data.success) {
          setSections(res.data.data)
        }
      } catch (err) {
        console.error("Error fetching filter sections:", err)
      }
    }
    fetchSections()
  }, [selectedClass])

  const handleSearch = useCallback((val: string) => {
    setSearch(val)
    setPage(1)
    setSelectedIds([])
  }, [])

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = students.map((s) => s.id)
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const handleEditClick = () => {
    if (selectedIds.length !== 1) return
    const idToEdit = selectedIds[0]
    const student = students.find((s) => s.id === idToEdit)
    if (student) {
      setStudentToEdit(student)
      setIsEditModalOpen(true)
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      setIsDeleting(true)
      const token = localStorage.getItem("token")
      const headers = { Authorization: `Bearer ${token}` }
      const res = await axios.post(`${API_BASE}/api/students/bulk-delete`, { ids: selectedIds }, { headers })
      if (res.data.success) {
        setSelectedIds([])
        setIsDeleteModalOpen(false)
        refetch()
      } else {
        alert("Failed to delete students.")
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting students.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-5 h-full">
        <StudentsHeader
          totalCount={pagination?.total ?? 0}
          search={search}
          onSearchChange={handleSearch}
          onAddClick={() => setIsAddModalOpen(true)}
        />

        <StudentFilters
          selectedClass={selectedClass}
          onClassChange={(value) => {
            setSelectedClass(value)
            setPage(1)
            setSelectedIds([])
          }}
          selectedSection={selectedSection}
          onSectionChange={(value) => {
            setSelectedSection(value)
            setPage(1)
            setSelectedIds([])
          }}
          selectedGender={selectedGender}
          onGenderChange={(value) => {
            setSelectedGender(value)
            setPage(1)
            setSelectedIds([])
          }}
          selectedStatus={selectedStatus}
          onStatusChange={(value) => {
            setSelectedStatus(value)
            setPage(1)
            setSelectedIds([])
          }}
          selectedYear={selectedYear}
          onYearChange={(value) => {
            setSelectedYear(value)
            setPage(1)
            setSelectedIds([])
          }}
          classes={classes}
          sections={sections}
          years={years}
        />

        <StudentStatsCards stats={stats} />

        <div className="flex-1 min-h-0 overflow-hidden">
          <StudentTable
            students={students}
            selectedIds={selectedIds}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            onEditClick={handleEditClick}
            onDeleteClick={() => setIsDeleteModalOpen(true)}
            isLoading={loading}
            error={error}
          />
        </div>

        <StudentPagination
          total={pagination?.total ?? 0}
          perPage={pagination?.limit ?? PAGE_SIZE}
          currentPage={pagination?.page ?? 1}
          onPageChange={(p) => {
            setPage(p)
            setSelectedIds([])
          }}
        />
      </div>

      {/* Add Student Modal */}
      <AddNewStudentModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSuccess={() => {
          setIsAddModalOpen(false)
          refetch()
        }}
        classes={classes}
      />

      {/* Edit Student Modal */}
      <AddNewStudentModal 
        isOpen={isEditModalOpen} 
        onClose={() => {
          setIsEditModalOpen(false)
          setStudentToEdit(null)
          setSelectedIds([])
        }} 
        onSuccess={() => {
          setIsEditModalOpen(false)
          setStudentToEdit(null)
          setSelectedIds([])
          refetch()
        }}
        studentToEdit={studentToEdit}
        classes={classes}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteStudentModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
        count={selectedIds.length}
      />
    </>
  )
}