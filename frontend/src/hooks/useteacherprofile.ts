import { useEffect, useState } from "react";
import axios from "axios";
import type { TeacherProfileData } from "../types/teacherprofile";
import { API_BASE_URL } from "../lib/api";

/**
 * Shared hook — fetches the logged-in teacher's profile from GET /api/teachers/me
 * Used by: TeacherDashboard (for name in WelcomeBanner), TeacherProfilePage, etc.
 *
 * Returns the same shape as TeacherProfilePage's local state so switching to
 * this hook in TeacherProfilePage is a drop-in replacement.
 */
const useTeacherProfile = () => {
  const [teacher, setTeacher] = useState<TeacherProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE_URL}/api/teachers/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeacher(res.data.data);
      } catch (err) {
        console.error("Failed to load teacher profile:", err);
        setError("Failed to load profile.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { teacher, isLoading, error };
};

export default useTeacherProfile;