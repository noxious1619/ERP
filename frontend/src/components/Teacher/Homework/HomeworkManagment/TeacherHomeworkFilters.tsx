import { useState } from "react";
import { ChevronDown } from "lucide-react";

const TABS = ["All", "Today"];

const CLASS_OPTIONS = ["Class X", "Class XI", "Class XII"];

const SECTION_OPTIONS = ["Section A", "Section B", "Section C", "Section D"];

const TeacherHomeworkFilters = () => {
  const [activeTab, setActiveTab] = useState("Today");

  const [selectedClass, setSelectedClass] = useState("Class X");
  const [selectedSection, setSelectedSection] = useState("Section A");

  const [classOpen, setClassOpen] = useState(false);
  const [sectionOpen, setSectionOpen] = useState(false);

  return (
    <div className="border-b border-[#EAECF0]">
      <div className="flex items-center justify-between">
        {/* Left: Tabs */}
        <div className="flex items-center gap-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                pb-4
                text-[15px]
                font-medium
                whitespace-nowrap
                transition-all
                cursor-pointer
                ${
                  activeTab === tab
                    ? "text-[#101828] border-b-2 border-[#1D2939]"
                    : "text-[#98A2B3] hover:text-[#667085]"
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Filters */}
        <div className="flex items-center gap-3 pb-3">
          {/* Class Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setClassOpen(!classOpen);
                setSectionOpen(false);
              }}
              className="
                h-[40px]
                min-w-[120px]
                px-4
                bg-white
                border border-[#EAECF0]
                rounded-full
                flex items-center justify-between
                gap-2
                shadow-sm
                text-[14px]
                font-medium
                text-[#344054]
                cursor-pointer
              "
            >
              {selectedClass}
              <ChevronDown size={14} />
            </button>

            {classOpen && (
              <div className="absolute top-full right-0 mt-2 w-[150px] bg-white rounded-2xl shadow-lg border border-[#EAECF0] z-50 overflow-hidden">
                {CLASS_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedClass(item);
                      setClassOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-[14px] hover:bg-gray-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Section Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setSectionOpen(!sectionOpen);
                setClassOpen(false);
              }}
              className="
                h-[40px]
                min-w-[130px]
                px-4
                bg-white
                border border-[#EAECF0]
                rounded-full
                flex items-center justify-between
                gap-2
                shadow-sm
                text-[14px]
                font-medium
                text-[#344054]
                cursor-pointer
              "
            >
              {selectedSection}
              <ChevronDown size={14} />
            </button>

            {sectionOpen && (
              <div className="absolute top-full right-0 mt-2 w-[165px] bg-white rounded-2xl shadow-lg border border-[#EAECF0] z-50 overflow-hidden">
                {SECTION_OPTIONS.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSelectedSection(item);
                      setSectionOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-[14px] hover:bg-gray-50"
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherHomeworkFilters;
