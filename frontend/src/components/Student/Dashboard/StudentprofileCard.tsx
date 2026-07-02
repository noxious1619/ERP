import React from "react";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Define the exact props we expect from the Dashboard
interface StudentProfileCardProps {
  firstName: string;
  lastName: string;
  studentId: string;
  grade: string;
}

const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  firstName,
  lastName,
  studentId,
  grade,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-[330px] h-[220px] bg-blue-500 rounded-3xl overflow-hidden shrink-0 ">
      {/* Top Info */}
      <div className="flex items-start justify-between px-5 pt-5 relative z-20">
        <div>
          {/* Force uppercase to match your UI mockup */}
          <p className="text-white font-medium leading-tight text-[13px] uppercase">{firstName}</p>
          <p className="text-white font-medium leading-tight text-[13px] uppercase">{lastName}</p>
        </div>

        <div className="text-right">
          <p className="text-white/80 leading-tight text-[10px]">
            S. ID: {studentId}
          </p>

          <p className="text-white/80 mt-1 text-[10px] uppercase">{grade}</p>
        </div>
      </div>

      {/* Student Image */}
      {/* <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
        <img
          // Prioritize dynamic image, fallback to your local static asset if null
          src={profileImageUrl || studentPhoto}
          alt={`${firstName} ${lastName}`}
          className="h-[205px] max-w-none object-contain"
        />
      </div> */}

      {/* Large User Icon */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <CircleUserRound
          size={120}
          strokeWidth={1.5}
          className="text-white/30"
        />
      </div>
      
      {/* Button */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[78%]">
        <button
          onClick={() => navigate("/student/profile")}
          className="w-full bg-white rounded-[5px] hover:bg-gray-100 transition-all outline outline-1 outline-offset-[-1px] outline-zinc-500/50 text-[#1e1b7a] font-medium text-[11px] p-[4px] cursor-pointer"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default StudentProfileCard;