import { useState, useEffect } from "react";
import axios from "axios";
// Assuming you have a hook to grab the user's token. Adjust the import if yours is named differently!
import useAuth from "./useAuth"; 

interface FetchParams {
  assignmentId: string;
  search: string;
  status: "ALL" | "SUBMITTED" | "LATE" | "MISSING";
  page: number;
}

export const useSubmissionList = ({ assignmentId, search, status, page }: FetchParams) => {
  const [data, setData] = useState<any>(null);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Grab the teacher's JWT token
  const { token } = useAuth(); 

  useEffect(() => {
    // Don't fetch if we don't have an ID or token yet
    if (!assignmentId || !token) return;

    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/assignments/${assignmentId}/submissions`, 
          {
            // These match the req.query parameters in your backend!
            params: { search, status, page, pageSize: 10 },
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setData(res.data.data);
        setPagination(res.data.pagination);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    // Add a 300ms delay for the search bar so it doesn't spam your backend on every single keystroke
    const timeoutId = setTimeout(() => {
      fetchSubmissions();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [assignmentId, search, status, page, token]);

  return { data, pagination, loading, error };
};