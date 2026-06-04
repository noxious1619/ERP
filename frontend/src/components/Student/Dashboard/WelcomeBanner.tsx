import React from "react";
import { useNavigate } from "react-router-dom";
import bookIcon from "../../../assets/Student/Dashboard/WelcomeBanner/book.png";

// Define the props interface
interface WelcomeBannerProps {
  studentName: string;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ studentName }) => {
  const navigate = useNavigate();
  return (
    <div className="relative rounded-[32px] overflow-hidden flex flex-col justify-center px-7 w-full h-[220px] bg-linear-65 from-blue-600 to-white ">
      
      {/* Decorative Book */}
      <div className="absolute right-[-25px] bottom-[-18px] pointer-events-none select-none">
        <img
          src={bookIcon}
          alt=""
          className="w-[220px] h-[220px] object-contain"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2.5">
        <h1 className="text-white font-bold leading-tight text-[22px]">
          {/* Inject the passed prop here */}
          Hello, {studentName}! Ready for today's <br /> classes?
        </h1>
        <p className="text-white/80 text-[13px]">
          Success is the sum of small efforts, repeated day in and day out
        </p>
        <div>
          <button 
            onClick={() => navigate('/student/timetable')}
            className="bg-white font-semibold rounded-full hover:bg-gray-100 transition-colors text-[13px] px-6 py-2.5 text-[#0ea5e9] mt-2 ">
            View Schedule
          </button>
        </div>
      </div>
      
    </div>
  );
};

export default WelcomeBanner;