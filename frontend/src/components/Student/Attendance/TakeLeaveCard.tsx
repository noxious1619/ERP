import leaveIcon from "../../../assets/Student/Attendance/leaveicon.svg";

const TakeLeaveCard = () => {
  return (
    <div className="w-70 h-60 p-5 bg-white rounded-3xl shadow-[0px_4px_6px_-4px_rgba(0,0,0,0.10)] shadow-lg  px-7 pb-6 pt-6 ">
      {/* Heading */}
      <h2 className="text-[20px] font-bold leading-none text-[#2D2D2D]">
        Need a break?
      </h2>

      {/* Description */}
      <p className="mt-5 max-w-[250px] text-sm  text-zinc-600">
        Apply for leaves and manage your academic absences directly from here.
      </p>

      {/* Button */}
      <button className="mt-7 flex w-56 h-14 w-full items-center justify-center gap-3 rounded-full bg-[#3A71FF] text-[14px] font-semibold text-white shadow-[0px_12px_24px_rgba(63,108,246,0.28)] transition-all duration-300 hover:scale-[1.02]">
        <img src={leaveIcon} alt="Leave" className="size-4" />
        <span>Apply for Leave</span>
      </button>
    </div>
  );
};

export default TakeLeaveCard;
