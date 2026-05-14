import Navbar from "../../components/Student/Dashboard/Navbar";
import TopBar from "../../components/Student/Dashboard/TopBar";
import WelcomeBanner from "../../components/Student/Dashboard/WelcomeBanner";
import StudentProfileCard from "../../components/Student/Dashboard/StudentprofileCard";
import TimetableSection from "../../components/Student/Dashboard/TimetableSection";
import Homework from "../../components/Student/Dashboard/Homework";
import NoticeBoard from "../../components/Student/Dashboard/NoticeBoard";
import CalendarMessageCard from "../../components/Student/Dashboard/CalendarMessageCard";
import Calendar from "../../components/Student/Dashboard/Calendar";
import YourSubjects from "../../components/Student/Dashboard/YourSubjects";
const Dashboard = () => {
  return (
    <div className="flex gap-8 items-start">
      <Navbar />
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <TopBar />
        <div className=" flex gap-8">
          <div className="flex-1 min-w-0">
            <WelcomeBanner />
          </div>

          <div className="w-[330px] shrink-0 mr-6">
            <StudentProfileCard />
          </div>
        </div>
        {/* Bottom Content */}
        <div className="flex gap-5 items-start">
          {/* Left Content */}
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <TimetableSection />
            <div className="flex gap-5 items-start">
              <div className="flex-1 min-w-0">
                <Homework />
              </div>
              <div className="flex-1 min-w-0 ">
                <NoticeBoard />
              </div>
            </div>
            <YourSubjects />
          </div>
          {/* RIGHT COLUMN */}
          <div className="w-[290px] shrink-0 flex flex-col gap-5 mr-16 mt-8">
            <Calendar />
            <CalendarMessageCard />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
