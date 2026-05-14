import { MapPin, User } from "lucide-react";
type WeeklyClassCardProps = {
  code: string;
  subject: string;
  teacher: string;
  location: string;
  accentColor: string;
};
const WeeklyClassCard = ({
  code,
  subject,
  teacher,
  location,
  accentColor,
}: WeeklyClassCardProps) => {
  return (
    <div
      className="h-[108px] w-full rounded-[20px] bg-white px-4 py-3 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
      style={{
        borderLeft: `3px solid ${accentColor}`,
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[1px]"
        style={{ color: accentColor }}
      >
        {code}
      </p>
      {/* Subject */}
      <h3 className="mt-1 text-sm font-bold leading-[20px] text-[#2B2F38]">
        {subject}
      </h3>
      {/* Teacher */}
      <div className="mt-2 flex items-center gap-1.5 text-[8px] text-[#707789]">
        <User size={11} strokeWidth={2.2} />
        <span>{teacher}</span>
      </div>
      {/* Location */}
      <div className="mt-1 flex items-center gap-1.5 text-[8px] text-[#707789]">
        <MapPin size={11} strokeWidth={2.2} />
        <span>{location}</span>
      </div>
    </div>
  );
};
export default WeeklyClassCard;
