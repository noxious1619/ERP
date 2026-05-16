import "../../style/Student/Profile/profilepage.css";
import Sidebar from "../../components/Student/Dashboard/Navbar";
import ProfileHeader from "../../components/Student/Profile/Header";
import StudentProfile from "../../components/Student/Profile/StudentProfile";
import GuardianCard from "../../components/Student/Profile/GuardianCard";
import AcademicPerformance from "../../components/Student/Profile/AcademicPerformance";
import DateCard from "../../components/Student/Profile/DateCard";
import AttendanceCard from "../../components/Student/Profile/AttendanceCard";

const Profile = () => {
  return (
    <div className="profile-gradient-bg flex min-h-screen  overflow-x-hidden">
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
              <GuardianCard />
              <AcademicPerformance />
              <AttendanceCard />
            </div>

            {/* Right */}
            <div className="shrink-0">
              <DateCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
