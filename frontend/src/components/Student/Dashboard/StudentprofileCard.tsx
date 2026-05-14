import React from "react";
import studentPhoto from "../../../assets/Student/Dashboard/StudentprofileCard/student.png";
import { useNavigate } from "react-router-dom";
const StudentProfileCard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-[330px] h-[220px] bg-blue-500 rounded-3xl overflow-hidden shrink-0 ">
      {/* Top Info */}
      <div className="flex items-start justify-between px-5 pt-5 relative z-20">
        <div>
          <p className="text-white  leading-tight text-[13px]">OJAS</p>
          <p className="text-white  leading-tight text-[13px]">SHARMA</p>
        </div>

        <div className="text-right">
          <p className="text-white/80 leading-tight text-[10px]">
            S. ID: #EDA-2024-098
          </p>

          <p className="text-white/80 mt-1 text-[10px]">Grade 11-A</p>
        </div>
      </div>

      {/* Student Image */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
        <img
          src={studentPhoto}
          alt="student"
          className="h-[205px] max-w-none object-contain"
        />
      </div>
      {/* Button */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[78%]">
        <button
          onClick={() => navigate("/student/profile")}
          className="w-full bg-white  rounded-[5px] hover:bg-gray-100 transition-all outline outline-1 outline-offset-[-1px] outline-zinc-500/50 text-[#1e1b7a] text-[11px]  p-[4px]"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default StudentProfileCard;
