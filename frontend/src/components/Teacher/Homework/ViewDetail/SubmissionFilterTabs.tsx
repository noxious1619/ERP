type FilterTab = "ALL" | "SUBMITTED" | "LATE" | "MISSING";

interface SubmissionFilterTabsProps {
  active: FilterTab;
  onChange: (tab: FilterTab) => void;
}

const TABS: { key: FilterTab; color: string }[] = [
  { key: "ALL", color: "" },
  { key: "SUBMITTED", color: "bg-green-500" },
  { key: "LATE", color: "bg-yellow-400" },
  { key: "MISSING", color: "bg-red-500" },
];

const SubmissionFilterTabs = ({ active, onChange }: SubmissionFilterTabsProps) => {
  return (
    <div className="flex items-center gap-6 border-b border-[#EAECF0] mb-4">
      {TABS.map(({ key, color }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`flex items-center gap-2 pb-3 text-[13px] font-semibold transition-all ${
            active === key
              ? "text-[#4D8DFF] border-b-2 border-[#4D8DFF]"
              : "text-[#98A2B3] hover:text-gray-600"
          }`}
        >
          {color && (
            <span className={`w-2 h-2 rounded-full ${color} inline-block`} />
          )}
          {key}
        </button>
      ))}
    </div>
  );
};

export default SubmissionFilterTabs;