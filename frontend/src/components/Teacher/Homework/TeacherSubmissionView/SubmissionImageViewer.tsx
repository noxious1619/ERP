import { useState } from "react";
import { PanelRightOpen, ImageOff } from "lucide-react";

interface Props {
  images?: string[];
  sidebarOpen: boolean;
  onOpenSidebar: () => void;
}

// Detect PDFs by extension/path
const isPdfFile = (file: string) => file.toLowerCase().includes(".pdf");

// Convert Google Drive share links into their embeddable preview URL.
// Direct file URLs (your own backend/S3/Cloudinary/etc.) are returned as-is.
const toEmbeddableUrl = (file: string) => {
  if (file.includes("drive.google.com")) {
    const match = file.match(/[-\w]{25,}/); // extract the Drive file ID
    return match ? `https://drive.google.com/file/d/${match[0]}/preview` : file;
  }
  return file;
};

const SubmissionImageViewer = ({
  images = [],
  sidebarOpen,
  onOpenSidebar,
}: Props) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // No attachments
  if (!images || images.length === 0) {
    return (
      <div className="flex-1 h-full bg-white rounded-[18px] border border-[#EAECF0] flex flex-col items-center justify-center text-gray-400 shadow-sm relative">
        <ImageOff className="w-12 h-12 mb-3 text-gray-300" strokeWidth={1.5} />

        <p className="text-[15px] font-medium text-gray-500">
          No attachments provided
        </p>

        <p className="text-[13px] text-gray-400 mt-1">
          This student did not upload any files.
        </p>

        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-[#4D8DFF] hover:border-[#4D8DFF] transition-all cursor-pointer"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }

  const currentFile = images[activeIndex];
  const isPdf = isPdfFile(currentFile);

  return (
    <div className="flex gap-3 h-full">
      {/* Main Preview */}
      <div className="relative flex-1 bg-white rounded-[18px] border border-[#EAECF0] overflow-hidden shadow-sm">
        {isPdf ? (
          <iframe
            src={toEmbeddableUrl(currentFile)}
            title="PDF Viewer"
            className="w-full h-full border-0"
          />
        ) : (
          <img
            src={currentFile}
            alt={`Submission ${activeIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}

        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400 hover:text-[#4D8DFF] hover:border-[#4D8DFF] transition-all cursor-pointer"
          >
            <PanelRightOpen className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="flex flex-col gap-2 w-[80px] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {images.map((file, index) => {
            const pdf = isPdfFile(file);

            return (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-[80px] h-[90px] rounded-[10px] overflow-hidden border-2 transition-all shrink-0 ${
                  activeIndex === index
                    ? "border-[#4D8DFF] shadow-md"
                    : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-300"
                }`}
              >
                {pdf ? (
                  <div className="w-full h-full bg-red-50 flex flex-col items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="30"
                      height="30"
                      viewBox="0 0 24 24"
                      fill="#DC2626"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zm0 0v6h6" />
                    </svg>

                    <span className="text-[10px] font-semibold mt-1">PDF</span>
                  </div>
                ) : (
                  <img
                    src={file}
                    alt={`Attachment ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubmissionImageViewer;
