
interface NoticeBoardFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}
const FILTERS = [
  { label: "All", value: "ALL" },
  { label: "Announcements", value: "ANNOUNCEMENT" },
  { label: "Academic", value: "ACADEMIC" },
  { label: "Holidays", value: "HOLIDAY" },
  { label: "Exams", value: "EXAM" },
  { label: "School events", value: "SCHOOL_EVENT" },
];
const Filters = ({ activeFilter, onFilterChange }: NoticeBoardFiltersProps) => {
  return (
    <div className="mt-4 border-b border-[#D9D9D9]">
      <div className="flex items-center gap-14">
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter.value;
          return (
            <button
              key={filter.value}
              onClick={() => onFilterChange(filter.value)}
              className={`
                relative pb-3 text-[16px] font-[500] transition-colors
                ${isActive ? "text-[#111111]" : "text-[#7C7C7C] hover:text-[#111111] cursor-pointer"}
              `}
            >
              {filter.label}
              {isActive && (
                <span
                  className="
                    absolute bottom-0 left-1/2
                    h-[3px] w-[44px] -translate-x-1/2
                    rounded-full bg-[#111111]
                  "
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
export default Filters;
