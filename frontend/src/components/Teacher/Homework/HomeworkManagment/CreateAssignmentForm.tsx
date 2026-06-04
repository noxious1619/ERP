import { useState, useRef } from "react";

import {
  X,
  FileText,
  Upload,
  Calendar,
  Clock3,
  ChevronDown,
  Link2,
  Trash2,
} from "lucide-react";

interface AssignHomeworkModalProps {
  open: boolean;
  onClose: () => void;
}

const CLASS_OPTIONS = ["Class X", "Class XI", "Class XII"];
const SECTION_OPTIONS = ["Section A", "Section B", "Section C", "Section D"];

const AssignHomeworkModal = ({ open, onClose }: AssignHomeworkModalProps) => {
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [links, setLinks] = useState<string[]>([]);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkValue, setLinkValue] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;
  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    setFiles((prev) => [...prev, ...Array.from(selectedFiles)]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const addLink = () => {
    if (!linkValue.trim()) return;

    setLinks((prev) => [...prev, linkValue]);

    setLinkValue("");
    setShowLinkInput(false);
  };

  const removeLink = (index: number) => {
    setLinks((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-[2px] flex items-center justify-center px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-[730px] max-h-[90vh] bg-white rounded-[16px] shadow-2xl flex flex-col overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border-2 border-[#4D8DFF] flex items-center justify-center bg-white z-10 hover:bg-blue-50 transition-colors"
        >
          <X className="w-4 h-4 text-[#4D8DFF]" />
        </button>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-8 py-7 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-[#4D8DFF]" />
            <h2 className="text-[20px] font-semibold text-[#222]">
              Assign Homework
            </h2>
          </div>

          {/* Row 1: Class + Section */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] appearance-none text-[16px] text-[#555] outline-none bg-white focus:border-[#4D8DFF] transition-colors"
              >
                <option value="">Class</option>
                {CLASS_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="relative">
              <select
                value={selectedSection}
                onChange={(e) => setSelectedSection(e.target.value)}
                className="w-full h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] appearance-none text-[16px] text-[#555] outline-none bg-white focus:border-[#4D8DFF] transition-colors"
              >
                <option value="">Section</option>
                {SECTION_OPTIONS.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Row 2: Chapter + Topic */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input
              placeholder="Chapter"
              className="h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] text-[16px] outline-none focus:border-[#4D8DFF] transition-colors"
            />
            <input
              placeholder="Topic"
              className="h-[56px] px-4 border border-[#D9D9D9] rounded-[10px] text-[16px] outline-none focus:border-[#4D8DFF] transition-colors"
            />
          </div>

          {/* Description */}
          <textarea
            placeholder="Description"
            className="w-full h-[110px] px-4 py-3 border border-[#D9D9D9] rounded-[10px] resize-none text-[16px] outline-none focus:border-[#4D8DFF] transition-colors mb-4"
          />

          {/* Due Date + Time */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="relative border border-[#D9D9D9] rounded-[10px] h-[56px] px-4 flex items-center gap-3">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-500">
                Due Date
              </label>
              <Calendar className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                className="flex-1 text-[15px] text-gray-600 outline-none bg-transparent"
              />
            </div>

            <div className="relative border border-[#D9D9D9] rounded-[10px] h-[56px] px-4 flex items-center gap-3">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-gray-500">
                Time
              </label>
              <Clock3 className="w-5 h-5 text-gray-400" />
              <input
                type="time"
                className="flex-1 text-[15px] text-gray-600 outline-none bg-transparent"
              />
            </div>
          </div>

          {/* Attachments */}
          {/* Attachments */}

          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-[16px] font-semibold text-gray-800 mb-3">
              <Upload className="w-5 h-5 text-[#4D8DFF]" />
              Attachments
            </h3>

            {/* Hidden Input */}

            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            {/* Upload Area */}

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="
      border-2
      border-dashed
      border-[#D7DCE5]
      rounded-[12px]
      h-[160px]
      flex
      flex-col
      items-center
      justify-center
      bg-[#FAFBFC]
      cursor-pointer
      hover:border-[#4D8DFF]
      transition-colors
    "
            >
              <Upload className="w-9 h-9 text-gray-400 mb-3" />

              <p className="text-[15px] text-gray-700">
                <span className="text-[#4D8DFF] font-medium">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>

              <p className="text-[13px] text-[#667085] mt-1">
                PDFs, Images, Documents, Videos, or Links
              </p>
            </div>

            {/* Uploaded Files */}

            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="
            flex
            items-center
            justify-between
            px-4
            py-2
            rounded-lg
            border
            bg-[#F9FAFB]
          "
                  >
                    <div className="flex items-center gap-2">
                      <FileText size={16} />

                      <span className="text-sm">{file.name}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Link */}

            <button
              type="button"
              onClick={() => setShowLinkInput(true)}
              className="
      mt-4
      px-5
      h-[40px]
      rounded-full
      border
      border-[#4D8DFF]
      text-[#4D8DFF]
      text-[13px]
      font-medium
      flex
      items-center
      gap-2
    "
            >
              <Link2 size={15} />
              ADD LINK
            </button>

            {/* Link Input */}

            {showLinkInput && (
              <div className="mt-3 flex gap-2">
                <input
                  value={linkValue}
                  onChange={(e) => setLinkValue(e.target.value)}
                  placeholder="https://..."
                  className="
          flex-1
          h-[42px]
          px-4
          border
          rounded-lg
          outline-none
        "
                />

                <button
                  type="button"
                  onClick={addLink}
                  className="
          px-5
          rounded-lg
          bg-[#4D8DFF]
          text-white
        "
                >
                  Add
                </button>
              </div>
            )}

            {/* Added Links */}

            {links.length > 0 && (
              <div className="mt-4 space-y-2">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="
            flex
            items-center
            justify-between
            px-4
            py-2
            rounded-lg
            border
            bg-[#F9FAFB]
          "
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noreferrer"
                      className="
              text-[#4D8DFF]
              text-sm
              truncate
            "
                    >
                      {link}
                    </a>

                    <button
                      type="button"
                      onClick={() => removeLink(index)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer — sticky at bottom */}
        <div className="px-8 py-5 border-t border-[#F2F4F7] flex justify-end gap-3 bg-white">
          <button
            onClick={onClose}
            className="h-[46px] px-7 rounded-full border border-[#D0D5DD] text-[#667085] text-[14px] font-medium hover:bg-gray-50 transition-colors"
          >
            SAVE AS DRAFT
          </button>
          <button className="h-[46px] px-8 rounded-full bg-[#4D8DFF] text-white text-[14px] font-semibold shadow-md hover:bg-[#3d7dee] transition-colors">
            ASSIGN HOMEWORK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignHomeworkModal;
