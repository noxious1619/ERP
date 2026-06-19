import { useState } from "react";
import { PanelRightOpen, ImageOff } from "lucide-react";

interface Props {
  images?: string[];
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}

const SubmissionImageViewer = ({ images = [], sidebarOpen, onOpenSidebar }: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback if the student didn't upload any images
  if (!images || images.length === 0) {
    return (
      <div className="flex-1 h-full bg-white rounded-[18px] border border-[#EAECF0] flex flex-col items-center justify-center text-gray-400 shadow-sm relative">
        <ImageOff className="w-12 h-12 mb-3 text-gray-300" strokeWidth={1.5} />
        <p className="text-[15px] font-medium text-gray-500">No attachments provided</p>
        <p className="text-[13px] text-gray-400 mt-1">This student did not upload any files.</p>
        
        {/* Reopen sidebar button (even if no images exist, teacher needs to grade!) */}
        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-[#4D8DFF] hover:border-[#4D8DFF] transition-all cursor-pointer"
            title="Open grading panel"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex gap-3 h-full">
      {/* Main preview */}
      <div className="relative flex-1 bg-white rounded-[18px] border border-[#EAECF0] overflow-hidden shadow-sm">
        <img
          src={images[activeIndex]}
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
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-[80px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`
                w-[80px] h-[90px] rounded-[10px] overflow-hidden shrink-0
                border-2 transition-all cursor-pointer
                ${activeIndex === i ? "border-[#4D8DFF] shadow-md" : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-300"}
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
      )}
    </div>
  );
};

export default SubmissionImageViewer;