"use client"

import { useState, useCallback } from "react"
import StudentsHeader from "./StudentHeader"
import StudentFilters from "./StudentFilters"
import StudentStatsCards from "./StudentStatsCards"
import StudentTable from "./StudentTable"
import StudentPagination from "./StudentPagination"
import AddNewStudentModal from "./AddNewStudentModal"
import { useStudents } from "../../../hooks/useStudents"

const PAGE_SIZE = 6

export default function StudentsView() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSection, setSelectedSection] = useState("")
  const [selectedGender, setSelectedGender] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedYear, setSelectedYear] = useState("")

  const {
    students,
    pagination,
    loading,
    error,
  } = useStudents({
    search,
    page,
    limit: PAGE_SIZE,

    classId: selectedClass,
    sectionId: selectedSection,
    gender: selectedGender,
    status: selectedStatus,
  })

  const handleSearch = useCallback((val: string) => {
    setSearch(val)
    setPage(1)
  }, [])

  return (
    <>
      <div className="flex flex-col gap-5">
        <StudentsHeader
          totalCount={pagination?.total ?? 0}
          search={search}
          onSearchChange={handleSearch}
          onAddClick={() => setIsModalOpen(true)}
        />

        <StudentFilters
        onClassChange={(value) => {
          setSelectedClass(value)
          setPage(1)
        }}
        onSectionChange={(value) => {
          setSelectedSection(value)
          setPage(1)
        }}
        onGenderChange={(value) => {
          setSelectedGender(value)
          setPage(1)
        }}
        onStatusChange={(value) => {
          setSelectedStatus(value)
          setPage(1)
        }}
        onYearChange={(value) => {
          setSelectedYear(value)
          setPage(1)
        }}
      />

      <StudentStatsCards students={students} />

      <StudentTable
        students={students}
        loading={loading}
        error={error}
      />

        <StudentPagination
          total={pagination?.total ?? 0}
          perPage={pagination?.limit ?? PAGE_SIZE}
          currentPage={pagination?.page ?? 1}
          onPageChange={setPage}
        />
      </div>

      <AddNewStudentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}