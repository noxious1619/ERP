import { Sigma, Microscope, Languages, X } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "Bio lab report due in 40 minutes",
    time: "40 mins ago",
    category: "Today",
    color: "bg-[#FFE3F1]",
    icon: <Microscope size={16} />,
    unread: true,
  },
  {
    id: 2,
    title: "Homework alert: Maths due in 2 hrs",
    time: "2 hours ago",
    category: "Today",
    color: "bg-[#ECE9FF]",
    icon: <Sigma size={16} />,
    unread: true,
  },
  {
    id: 3,
    title: "English essay deadline is getting close",
    time: "15 hours ago",
    category: "Today",
    color: "bg-[#E9F1FF]",
    icon: <Languages size={16} />,
    unread: false,
  },
  {
    id: 4,
    title: "Literature assignment due very soon",
    time: "1 day ago",
    category: "Yesterday",
    color: "bg-[#E9F1FF]",
    icon: <Languages size={16} />,
    unread: false,
  },
  {
    id: 5,
    title: "Homework hub: 3 assignments still due",
    time: "1 day ago",
    category: "Yesterday",
    color: "bg-[#FFE3F1]",
    icon: <Microscope size={16} />,
    unread: false,
  },
];

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown = ({ onClose }: NotificationDropdownProps) => {
  return (
    <div className="fixed right-[74px] top-[62px] z-50 w-[430px] overflow-hidden rounded-[10px] bg-white shadow-[0px_8px_50px_10px_rgba(0,0,0,0.15)] backdrop-blur-[2500px]">
      {/* Arrow pointer */}
      <div className="absolute right-[74px] top-[-10px] h-5 w-5 rotate-45 border-l border-t border-[#E8E8E8] bg-white" />

      <div className="px-6 pt-5 pb-4 flex items-center justify-between">
        <h2 className="text-[20px] font-semibold text-[#111111]">
          Notifications
        </h2>
        {/* Close button */}
        <button
          onClick={onClose}
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full text-[#8B8B8B] transition-colors hover:bg-[#F2F2F2] hover:text-[#111111]"
          aria-label="Close notifications"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex items-center gap-9 border-b border-[#E9E9E9] px-5">
        <button className="relative pb-3 text-[15px] font-semibold text-black">
          All
          <span className="ml-1 inline-flex h-[16px] w-[16px] items-center justify-center rounded-full bg-black text-[10px] text-white">
            3
          </span>
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-black" />
        </button>
      </div>

      <div className="max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#D0D0D0] scrollbar-track-transparent">
        {/* Today section */}
        <div className="border-b border-[#ECECEC] px-5 py-3 sticky top-0 bg-white z-10">
          <p className="text-[12px] font-semibold text-[#1A1A1A]">Today</p>
        </div>
        {notifications.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="flex items-start justify-between border-b border-[#EFEFEF] bg-indigo-300/10 px-5 py-4"
          >
            <div className="flex gap-3">
              <div
                className={`flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-full ${item.color}`}
              >
                <span className="text-[#1C197D]">{item.icon}</span>
              </div>
              <div>
                <h3 className="text-[16px] font-bold leading-[22px] text-[#121212]">
                  {item.title}
                </h3>
                <p className="mt-1 text-[13px] text-[#8B8B8B]">{item.time}</p>
              </div>
            </div>
            {item.unread && (
              <div className="mt-2 h-[7px] w-[7px] flex-shrink-0 rounded-full bg-[#17167A]" />
            )}
          </div>
        ))}

        {/* Yesterday section */}
        <div className="border-b border-[#ECECEC] px-5 py-3 sticky top-0 bg-white z-10">
          <p className="text-[12px] font-semibold text-[#1A1A1A]">Yesterday</p>
        </div>
        {notifications.slice(3).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 border-b border-[#EFEFEF] px-5 py-4"
          >
            <div
              className={`flex h-[32px] w-[32px] flex-shrink-0 items-center justify-center rounded-full ${item.color}`}
            >
              <span className="text-[#1C197D]">{item.icon}</span>
            </div>
            <div>
              <h3 className="text-[16px] font-semibold leading-[22px] text-[#121212]">
                {item.title}
              </h3>
              <p className="mt-1 text-[13px] text-[#8B8B8B]">{item.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationDropdown;
