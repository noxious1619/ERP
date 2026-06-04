import { useState } from "react";
import { PanelRightOpen } from "lucide-react";

const DUMMY_IMAGES = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
  "https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800",
  "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
];

interface Props {
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}

const SubmissionImageViewer = ({ sidebarOpen, onOpenSidebar }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex gap-3 h-full">
      {/* Main preview */}
      <div className="relative flex-1 bg-white rounded-[18px] border border-[#EAECF0] overflow-hidden shadow-sm">
        <img
          src={DUMMY_IMAGES[activeIndex]}
          alt={`Submission page ${activeIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Reopen sidebar button */}
        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#4D8DFF] hover:border-[#4D8DFF] transition-all cursor-pointer"
            title="Open student info"
          >
            <PanelRightOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Thumbnail strip */}
      <div className="flex flex-col gap-2 w-[80px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {DUMMY_IMAGES.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`
              w-[80px] h-[90px] rounded-[10px] overflow-hidden shrink-0
              border-2 transition-all
              ${activeIndex === i ? "border-[#4D8DFF] shadow-md" : "border-transparent hover:border-gray-300"}
            `}
          >
            <img
              src={img}
              alt={`Page ${i + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubmissionImageViewer;
