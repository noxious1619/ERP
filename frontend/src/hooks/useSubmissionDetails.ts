import { useState, useEffect } from 'react';
import axios from 'axios';
// If your AuthContext is located somewhere else, adjust this import path!
import  useAuth  from '../../src/hooks/useAuth';

const API_BASE_URL = 'http://localhost:5000/api'; 

export const useSubmissionDetail = (submissionId: string | undefined) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { token } = useAuth(); // Assuming your auth context gives you a JWT

  useEffect(() => {
    // If there is no ID in the URL, don't try to fetch
    if (!submissionId || !token) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data.data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching submission:", err);
        setError(err.response?.data?.message || "Failed to load submission details");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [submissionId, token]);

  // Function to save the grade
  const submitGrade = async (score: number, status: string, remarks: string) => {
    if (!submissionId || !token) return false;
    
    setSaving(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/submissions/${submissionId}/grade`,
        { score, status, remarks }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return true; 
    } catch (err: any) {
      console.error("Error saving grade:", err);
      alert(err.response?.data?.message || "Failed to save grade");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { data, loading, error, saving, submitGrade };
};