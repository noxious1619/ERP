import { MapPin, User } from "lucide-react";
import { APP_COLORS } from "../../../config/colors"; // Adjust path to your colors file

type WeeklyClassCardProps = {
  code: string;
  subject: string;
  teacher: string;
  location: string;
  accentColor: string; // Receives "BLUE", "GREEN", etc., from database
};

const WeeklyClassCard = ({
  code,
  subject,
  teacher,
  location,
  accentColor,
}: WeeklyClassCardProps) => {
  // Look up the pure hex code from your dictionary, fallback to SLATE hex if unmapped
  const hexValue = APP_COLORS[accentColor] || APP_COLORS.SLATE;

  return (
    <div
      className="h-[108px] w-full rounded-[20px] bg-white px-4 py-3 shadow-[0px_2px_6px_rgba(0,0,0,0.03)]"
      style={{
        borderLeft: `3px solid ${hexValue}`, // Applies pure hex dynamically
      }}
    >
      <p
        className="text-[10px] font-bold uppercase tracking-[1px]"
        style={{ color: hexValue }} // Applies pure hex dynamically
      >
        {code}
      </p>
      <h3 className="mt-1 text-sm font-bold leading-[20px] text-[#2B2F38]">
        {subject}
      </h3>
      <div className="mt-2 flex items-center gap-1.5 text-[8px] text-[#707789]">
        <User size={11} strokeWidth={2.2} />
        <span>{teacher}</span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[8px] text-[#707789]">
        <MapPin size={11} strokeWidth={2.2} />
        <span>{location}</span>
      </div>
    </div>
  );
};

export default WeeklyClassCard;