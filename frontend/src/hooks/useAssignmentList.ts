import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api/assignments";

export interface AssignmentCard {
  id: string;
  title: string;
  dueDate: string;
  maxScore: number;
  class: { id: string; name: string };
  section: { id: string; name: string } | null;
  subject: { id: string; name: string };
  attachmentCount: number;
  submissionCount: number;
}

export interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface UseAssignmentListParams {
  classId: string;
  sectionId: string;
  date: "today" | "all";
  page?: number;
  pageSize?: number;
}

const useAssignmentList = ({
  classId,
  sectionId,
  date,
  page = 1,
  pageSize = 10,
}: UseAssignmentListParams) => {
  const [assignments, setAssignments] = useState<AssignmentCard[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    if (!classId || !sectionId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.get(`${BASE_URL}/list`, {
        params: { classId, sectionId, date, page, pageSize },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAssignments(data.data);
        setPagination(data.pagination);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to fetch assignments.");
    } finally {
      setLoading(false);
    }
  }, [classId, sectionId, date, page, pageSize]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  return { assignments, pagination, loading, error, refetch: fetchAssignments };
};

export default useAssignmentList;