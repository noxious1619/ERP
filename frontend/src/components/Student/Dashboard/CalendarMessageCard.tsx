interface CalendarMessageCardProps {
className?: string;
}

const CalendarMessageCard = ({ className }: CalendarMessageCardProps) => {
  const containerWidth = className ?? "w-[330px]";

  return (
    <div
      className={`${containerWidth} rounded-3xl bg-white px-2 py-2 shadow-[0px_15px_25px_10px_rgba(0,0,0,0.05)]`}
    >
      {/* Date */}
      <div className="flex justify-center">
        <h2 className="text-[18px] font-bold text-black">24th August 2026</h2>
      </div>
      {/* Message Card */}
      <div className="mt-2 flex items-center gap-3 rounded-[20px] bg-[#F7F7FA] px-4 py-3">
        <div className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#72D83B]" />
        <div>
          <h3 className="text-[14px] font-semibold text-[#2B2B2B]">Holiday</h3>
          <p className="mt-1 text-[12px] leading-[18px] text-[#7A7A7A]">
            All students are informed that the school is going to have a holiday
            on 24th due to PTM and every student should be there to attend it.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CalendarMessageCard;
