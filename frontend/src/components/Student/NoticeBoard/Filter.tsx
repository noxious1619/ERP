const NoticeBoardFilters = () => {
  const filters = [
    "All",
    "Announcements",
    "Academic",
    "Holidays",
    "Exams",
    "School events",
  ];

  return (
    <div
      className="
        mt-10
        border-b
        border-[#D9D9D9]
      "
    >
      <div className="flex items-center gap-14">
        {filters.map((item, index) => (
          <button
            key={item}
            className={`
              relative
              pb-3
              text-[16px]
              font-[500]
              transition-colors
              ${
                index === 0
                  ? "text-[#111111]"
                  : "text-[#7C7C7C] hover:text-[#111111]"
              }
            `}
          >
            {item}

            {/* Active Underline */}
            {index === 0 && (
              <span
                className="
                  absolute
                  bottom-0
                  left-1/2
                  h-[3px]
                  w-[44px]
                  -translate-x-1/2
                  rounded-full
                  bg-[#111111]
                "
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoardFilters;
