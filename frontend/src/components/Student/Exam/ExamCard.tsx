interface ExamCardProps {
  title: string;
  syllabus: string;
  date: string;
  suffix: string;
  icon: string;
  bgColor: string;
  iconBg: string;
  textColor?: string;
}

const ExamCard = ({
  title,
  syllabus,
  date,
  suffix,
  icon,
  bgColor,
  iconBg,
  textColor = "#2D3335",
}: ExamCardProps) => {
  return (
    <div
      className="
        flex
        w-full
        items-center
        justify-between
        rounded-[28px]
        px-6
        py-5
        shadow-[0px_18px_40px_rgba(0,0,0,0.06)]
      "
      style={{
        backgroundColor: bgColor,
      }}
    >
      {/* LEFT */}
      <div className="flex items-center gap-5">
        {/* Icon */}
        <div
          className="
            flex
            h-[48px]
            w-[48px]
            items-center
            justify-center
            rounded-full
          "
          style={{ backgroundColor: iconBg }}
        >
          <img
            src={icon}
            alt={title}
            className="h-[28px] w-[28px] object-contain"
          />
        </div>

        {/* Content */}
        <div>
          <h3 className="text-[17px] font-[700] uppercase text-[#484848]">
            {title}
          </h3>

          <p className="mt-2 max-w-[360px] text-[13px] leading-[18px] text-[#484747]">
            <span className="font-[700] text-[#484848] font-bold">
              Syllabus :
            </span>{" "}
            {syllabus}
          </p>
        </div>
      </div>

      {/* DATE */}
      <div className="relative h-[74px] w-[74px] shrink-0">
        {/* 3×3 grid background */}
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="border border-black/20" />
          ))}
        </div>

        {/* Date text centered over the grid */}
        <div className="absolute inset-0 flex items-center ml-2 justify-center">
          <span className="text-4xl font-semibold leading-none text-[#484848]">
            {date}
          </span>
          <span
            className="mb-auto mt-1 ml-[2px] text-[12px] font-[600]"
            style={{ color: textColor }}
          >
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExamCard;
