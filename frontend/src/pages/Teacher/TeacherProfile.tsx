import { useEffect, useState } from "react";
import axios from "axios";
import "../../style/Student/Profile/profilepage.css";
import Sidebar from "../../components/Teacher/Dashboard/Navbar";
import ProfileHeader from "../../components/Student/Profile/Header";
import TeacherProfileCard from "../../components/Teacher/Profile/TeacherProfileCard";
import ProfessionalInfoCard from "../../components/Teacher/Profile/ProfessionalInfoCard";
import ContactCard from "../../components/Teacher/Profile/Contactcard";
import type { TeacherProfileData } from "../../types/teacherprofile";
import { API_BASE_URL } from "../../lib/api";
const TeacherProfilePage = () => {
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

  return (
    <div className="profile-gradient-bg flex min-h-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="px-4 py-8">
          <ProfileHeader />
          <div className="mt-10 flex items-start gap-6">
            {/* Left — personal info card */}
            <div className="shrink-0">
              <TeacherProfileCard
                teacher={teacher}
                isLoading={isLoading}
                error={error}
              />
            </div>
            {/* Center — professional + contact + attendance */}
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              <ProfessionalInfoCard teacher={teacher} isLoading={isLoading} />
              <ContactCard teacher={teacher} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherProfilePage;
