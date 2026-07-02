import { useEffect, useState } from "react";
import "../../style/Student/Profile/profilepage.css";
import Sidebar from "../../components/Student/Dashboard/Navbar";
import ProfileHeader from "../../components/Student/Profile/Header";
import StudentProfile from "../../components/Student/Profile/StudentProfile";
import GuardianCard, {
  type ParentData,
} from "../../components/Student/Profile/GuardianCard";
// import AcademicPerformance from "../../components/Student/Profile/AcademicPerformance";
// import AttendanceCard from "../../components/Student/Profile/AttendanceCard";
import axios from "axios";
const Profile = () => {
  const [parent, setParent] = useState<ParentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/students/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.data;
        setParent(json.data.parent ?? null);
      } catch (err) {
        console.error("Failed to load profile:", err);
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
            {/* Left */}
            <div className="shrink-0">
              <StudentProfile />
            </div>

            {/* Center */}
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <GuardianCard parent={parent} isLoading={isLoading} />
              {/* <AcademicPerformance />
              <AttendanceCard /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
