import { type DayStatus, PILL_HEX } from "./Attendancetypes ";

interface LegendItem {
  status: DayStatus;
  label: string;
}

const LEGEND_ITEMS: LegendItem[] = [
  { status: "present", label: "Present" },
  { status: "absent", label: "Absent" },
  { status: "holiday", label: "Holiday" },
  { status: "sunday", label: "Sunday" },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-[10px]">
      {LEGEND_ITEMS.map(({ status, label }) => (
        <div key={status} className="flex items-center gap-[5px]">
          <div
            className="w-4 h-[6px] rounded-[3px]"
            style={{ backgroundColor: PILL_HEX[status] }}
          />
          <span className="text-[10px] text-[#8A94A6]">{label}</span>
        </div>
      ))}
    </div>
  );
}
