"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  GetStudentsResponse,
  Student,
  Pagination,
} from "../types/student"
import { API_BASE_URL, getAuthHeaders } from "../lib/api"

interface UseStudentsOptions {
  search?: string
  sectionId?: string
  classId?: string
  gender?: string
  status?: string
  page?: number
  limit?: number
}

interface UseStudentsResult {
  students: Student[]
  pagination: Pagination | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useStudents({
  search = "",
  sectionId = "",
  classId = "",
  gender = "",
  status = "",
  page = 1,
  limit = 6,
}: UseStudentsOptions = {}): UseStudentsResult {
  const [students, setStudents] = useState<Student[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (search) params.set("search", search)
      if (sectionId) params.set("sectionId", sectionId)
      if (classId) params.set("classId", classId)
      if (gender) params.set("gender", gender)
      if (status) params.set("status", status)

      params.set("page", page.toString())
      params.set("limit", limit.toString())

      const url = `${API_BASE_URL}/students?${params.toString()}`

      console.log("Students API:", url)

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          body.message ?? `Request failed with status ${res.status}`
        )
      }

      const json: GetStudentsResponse = await res.json()

      setStudents(json.data)
      setPagination(json.pagination)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [
    search,
    sectionId,
    classId,
    gender,
    status,
    page,
    limit,
  ])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return {
    students,
    pagination,
    loading,
    error,
    refetch: fetchStudents,
  }
}