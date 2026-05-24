const notices = [
  {
    id: 1,
    title: "Exam is in next 4 days",
    description: "first subject will be maths and... .....",
  },
  {
    id: 2,
    title: "Exam is in next 4 days",
    description: "first subject will be maths and... .....",
  },
  {
    id: 3,
    title: "Exam is in next 4 days",
    description: "first subject will be maths and... .....",
  },
];
const NoticeBoard = () => {
  return (
    <div className="w-full rounded-3xl bg-white  py-11  shadow-[0px_15px_25px_10px_rgba(0,0,0,0.08)]">
      {/* Header */}
      <div className="flex justify-center ">
        <h2 className="text-[20px] font-bold text-black ">Notice Board</h2>
      </div>
      {/* Notice List */}
      <div className="mt-6 flex flex-col gap-2 px-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className="flex items-center gap-4 rounded-xl bg-blue-600/5 px-6 py-4"
          >
            {/*  Dot */}
            <div className="h-[10px] w-[10px] rounded-full bg-[#2E83F5]" />
            {/* Text Content */}
            <div className="flex flex-col">
              <h3 className="text-[14px] font-semibold leading-none text-[#2D2D2D]">
                {notice.title}
              </h3>
              <p className="mt-[5px] text-[10px] leading-[14px] text-[#8A8A8A]">
                {notice.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoticeBoard;
