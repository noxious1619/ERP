"use client"

import { useState, useEffect, useCallback } from "react"
import type { GetStudentsResponse, Student } from "../types/student"
import { API_BASE_URL, getAuthHeaders } from "../lib/api"


interface UseStudentsOptions {
  search?: string
  sectionId?: string
}

interface UseStudentsResult {
  students: Student[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useStudents({ search = "", sectionId = "" }: UseStudentsOptions = {}): UseStudentsResult {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState<string | null>(null)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      if (search)    params.set("search",    search)
      if (sectionId) params.set("sectionId", sectionId)

      const url = `${API_BASE_URL}/students${params.toString() ? `?${params}` : ""}`

      const res = await fetch(url, { headers: getAuthHeaders() })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message ?? `Request failed with status ${res.status}`)
      }

      const json: GetStudentsResponse = await res.json()
      setStudents(json.data)
    } catch (err: any) {
      setError(err.message ?? "Something went wrong")
    } finally {
      setLoading(false)
    }
  }, [search, sectionId])

  useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  return { students, loading, error, refetch: fetchStudents }
}

