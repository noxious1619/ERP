"use client"

import { useState, useCallback } from "react"
import StudentsHeader from "./StudentHeader"
import StudentFilters from "./StudentFilters"
import StudentStatsCards from "./StudentStatsCards"
import StudentTable from "./StudentTable"
import StudentPagination from "./StudentPagination"
import { useStudents } from "../../../hooks/useStudents"



const PAGE_SIZE = 10

export default function StudentsView() {
  const [search,    setSearch]    = useState("")
  const [sectionId, setSectionId] = useState("")
  const [page,      setPage]      = useState(1)

  const { students, loading, error, refetch } = useStudents({ search, sectionId })

  // client-side pagination over the API result
  const totalCount   = students.length
  const totalPages   = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const paginated    = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // reset to page 1 whenever filters change
  const handleSearch = useCallback((val: string) => {
    setSearch(val)
    setPage(1)
  }, [])

  const handleSectionChange = useCallback((val: string) => {
    setSectionId(val)
    setPage(1)
  }, [])

  return (
    <div className="flex flex-col gap-5">
      <StudentsHeader
        totalCount={totalCount}
        search={search}
        onSearchChange={handleSearch}
      />

      <StudentFilters onSectionChange={handleSectionChange} />

      <StudentStatsCards students={students} />

      <StudentTable
        students={paginated}
        loading={loading}
        error={error}
      />

      <StudentPagination
        total={totalCount}
        perPage={PAGE_SIZE}
        currentPage={page}
        onPageChange={setPage}
      />
    </div>
  )
}