"use client"

import { useState, useEffect, useCallback } from "react"
import { API_BASE_URL, getAuthHeaders } from "../lib/api"

export interface Subject {
  id: string
  name: string
  code: string
  classId: string
  className: string
  classes: string[]
  section: string
  teacherId: string | null
  teacherName: string
  teachers: string[]
  type: "Theory" | "Lab"
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Stats {
  total: number
  theory: number
  lab: number
  found: number
}

interface UseSubjectsOptions {
  search?: string
  classId?: string
  type?: string
  page?: number
  limit?: number
}

interface UseSubjectsResult {
  subjects: Subject[]
  pagination: Pagination | null
  stats: Stats | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useSubjects({
  search = "",
  classId = "",
  type = "",
  page = 1,
  limit = 6,
}: UseSubjectsOptions = {}): UseSubjectsResult {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubjects = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()

      if (search) params.set("search", search)
      if (classId && classId !== "All Classes") params.set("classId", classId)
      if (type && type !== "All Type") params.set("type", type)

      params.set("page", page.toString())
      params.set("limit", limit.toString())

      const url = `${API_BASE_URL}/academic/subjects?${params.toString()}`

      console.log("Subjects API call:", url)

      const res = await fetch(url, {
        headers: getAuthHeaders(),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(
          body.message ?? `Request failed with status ${res.status}`
        )
      }

      const json = await res.json()

      setSubjects(json.data || [])
      setPagination(json.pagination || null)
      setStats(json.stats || null)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [search, classId, type, page, limit])

  useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  return {
    subjects,
    pagination,
    stats,
    loading,
    error,
    refetch: fetchSubjects,
  }
}
