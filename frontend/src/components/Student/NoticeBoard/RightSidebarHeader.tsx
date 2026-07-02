// import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface RightSidebarHeaderProps {
  /** Where the profile avatar navigates to. Defaults to student profile. */
  profileRoute?: string;
}

const RightSidebarHeader = ({
  profileRoute = "/student/profile",
}: RightSidebarHeaderProps) => {
  // const [showNotifications, setShowNotifications] = useState(false);
  // const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       notificationRef.current &&
  //       !notificationRef.current.contains(event.target as Node)
  //     ) {
  //       setShowNotifications(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="flex items-center justify-end gap-10">
      {/* Notification */}
      {/* <div className="relative" ref={notificationRef}>
        <button
          onClick={() => setShowNotifications((prev) => !prev)}
          className="text-[#5C5C5C] transition-colors hover:text-[#3F5BF6] cursor-pointer"
        >
          <img src={notification} alt="Notification" className="h-6 w-6" />
          <div className="absolute right-[1px] top-[2px] h-[8px] w-[8px] rounded-full bg-[#FF4B6E]" />
        </button>
        {showNotifications && (
          <NotificationDropdown onClose={() => setShowNotifications(false)} />
        )}
      </div> */}

      {/* Profile */}
      <div
        onClick={() => navigate(profileRoute)}
        className="h-[52px] w-[52px] overflow-hidden rounded-full border-[3px] border-white shadow-md cursor-pointer"
      >
        <div className="h-full w-full flex items-center justify-center bg-blue-500 text-white text-lg font-bold">
          P
        </div>
      </div>
    </div>
  );
};

export default RightSidebarHeader;
