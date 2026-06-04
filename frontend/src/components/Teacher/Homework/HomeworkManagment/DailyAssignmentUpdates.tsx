const updates = [
  { id: 1, classLabel: "Class X – E", timing: "Today" },
  { id: 2, classLabel: "Class V – C", timing: "Today" },
  { id: 3, classLabel: "Class XI – B", timing: "Today" },
  { id: 4, classLabel: "Class VII – A", timing: "Today" },
  { id: 5, classLabel: "Class VI – A", timing: "Today" },
  { id: 6, classLabel: "Class XI– A", timing: "Due Tomorrow" },
];

const DailyAssignmentUpdates = () => {
  return (
    <div className="rounded-[18px] bg-white shadow-[0px_2px_12px_rgba(0,0,0,0.07)] border border-[#EAECF0] px-5 py-5">
      <h3 className="text-[15px] font-bold text-gray-800 mb-4">
        Daily Assignment Updates
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {updates.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-2 bg-[#F8F9FE] rounded-xl px-3 py-2.5"
          >
            <span className="mt-[5px] w-2 h-2 rounded-full bg-blue-500 shrink-0" />
            <div>
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                {item.classLabel}
              </p>
              <p className="text-[11px] text-gray-400 mt-[2px]">
                {item.timing}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyAssignmentUpdates;
