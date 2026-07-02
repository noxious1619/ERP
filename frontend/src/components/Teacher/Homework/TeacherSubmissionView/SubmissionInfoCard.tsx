import { useState } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Grade = "Complete" | "Incomplete" | "Wrong" | null;

interface SubmissionData {
  attachments?: string[];
  score?: number;
  submittedAt?: string;
  description?: string;
  student?: {
    name?: string;
    classSection?: string;
    rollNo?: string;
  };
  assignment?: {
    content?: string;
    maxScore?: number;
  };
}

interface Props {
  data: SubmissionData;
  saving: boolean;
  onSubmitGrade: (score: number, status: string, remarks: string) => void;
}
// Helper to format the date to match your exact UI
const formatSubmitDate = (isoString?: string) => {
  if (!isoString) return { month: "—", day: "—", fullDate: "—", time: "—" };
  const d = new Date(isoString);
  const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const day = d.getDate().toString();
  const fullDate = d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { month, day, fullDate, time };
};

const SubmissionInfoCard = ({ data, saving, onSubmitGrade }: Props) => {
  // Use backend attachments, fallback to empty array
  const images = data?.attachments || [];

  const [activeImage, setActiveImage] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(
    data?.score ? "Complete" : null,
  );
  const [marks, setMarks] = useState(data?.score?.toString() || "");

  const dateDetails = formatSubmitDate(data?.submittedAt);

  const handlePrev = () =>
    setActiveImage((i) => (i - 1 + images.length) % images.length);
  const handleNext = () => setActiveImage((i) => (i + 1) % images.length);

  const handleSave = () => {
    if (!selectedGrade) return;
    if (!marks || isNaN(Number(marks))) {
      alert("Please enter a valid number for marks.");
      return;
    }

    // Pass the marks and use the grade status as the remark
    onSubmitGrade(Number(marks), "GRADED", `Marked as: ${selectedGrade}`);
  };

  const grades: {
    label: "Complete" | "Incomplete" | "Wrong";
    textColor: string;
    borderActive: string;
    bgActive: string;
  }[] = [
    {
      label: "Complete",
      textColor: "text-[#4D8DFF]",
      borderActive: "border-[#4D8DFF]",
      bgActive: "bg-[#EEF3FF]",
    },
    {
      label: "Incomplete",
      textColor: "text-[#E8457A]",
      borderActive: "border-[#E8457A]",
      bgActive: "bg-[#FFF0F5]",
    },
    {
      label: "Wrong",
      textColor: "text-[#F59E0B]",
      borderActive: "border-[#F59E0B]",
      bgActive: "bg-[#FFFBEB]",
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Banner carousel ── */}
      {images.length > 0 ? (
        <div className="relative w-full h-[210px] shrink-0 overflow-hidden bg-gray-900">
          <img
            src={images[activeImage]}
            alt={`Submission page ${activeImage + 1}`}
            className="w-full h-full object-cover transition-opacity duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

          <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
            {activeImage + 1}/{images.length}
          </div>

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4 text-gray-700" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`rounded-full transition-all cursor-pointer ${
                      i === activeImage
                        ? "w-4 h-[6px] bg-white"
                        : "w-[6px] h-[6px] bg-white/50 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="w-full h-[140px] shrink-0 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
          <p className="text-[13px] font-medium">No Image Attachments</p>
        </div>
      )}

      {/* ── Content ── */}
      <div className="flex flex-col gap-[18px] px-6 pt-5 pb-7 flex-1">
        {/* Student name + class */}
        <div>
          <h2 className="text-[24px] font-bold text-gray-900 leading-snug">
            {data?.student?.name || "Student Name"}
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            {data?.student?.classSection || "Class - Unknown"} &nbsp;•&nbsp;
            Roll no: {data?.student?.rollNo || "-"}
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center rounded-[10px] border border-gray-200 overflow-hidden w-[44px] shadow-sm shrink-0">
            <div className="w-full bg-[#4285F4] text-white text-[9px] font-bold text-center py-[3px] tracking-widest">
              {dateDetails.month}
            </div>
            <div className="text-[17px] font-extrabold text-gray-800 leading-none py-[5px]">
              {dateDetails.day}
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-800">
              {dateDetails.fullDate}
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">
              {dateDetails.time}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-[12px] bg-[#F5F8FF] px-4 py-3">
          <p className="text-[11px] text-gray-400 font-medium mb-1">
            Description
          </p>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            {data?.description ||
              data?.assignment?.content ||
              "No description provided."}
          </p>
        </div>

        {/* Grade buttons */}
        <div>
          <p className="text-[12px] text-gray-400 font-medium mb-2.5">
            Mark submission as:
          </p>
          <div className="flex gap-2.5">
            {grades.map(({ label, textColor, borderActive, bgActive }) => (
              <button
                key={label}
                onClick={() => setSelectedGrade(label)}
                className={`
                  flex-1 h-[42px] rounded-full border-2 text-[12.5px] font-semibold transition-all cursor-pointer
                  ${
                    selectedGrade === label
                      ? `${bgActive} ${textColor} ${borderActive}`
                      : `bg-white ${textColor} border-[#E4E7EC] hover:bg-gray-50`
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Marks — floating label */}
        <div className="relative mt-2">
          <label className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] text-gray-400 font-medium z-10">
            Marks (Max: {data?.assignment?.maxScore || 100})
          </label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder={`Eg. 30/${data?.assignment?.maxScore || 100}`}
            className="w-full h-[50px] rounded-[12px] border border-gray-300 px-4 text-[13px] text-gray-700 placeholder-gray-300 outline-none focus:border-[#4D8DFF] transition-colors"
          />
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-1 min-h-[10px]" />

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!selectedGrade || saving}
          className={`
            w-full h-[52px] rounded-full text-[14px] font-bold tracking-widest
            transition-all mt-auto flex items-center justify-center gap-2
            ${
              selectedGrade && !saving
                ? "bg-[#4D8DFF] text-white shadow-md hover:bg-[#3d7dee] active:scale-[0.98] cursor-pointer"
                : "bg-white text-gray-300 border border-gray-200 cursor-not-allowed"
            }
          `}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              SAVING...
            </>
          ) : (
            "SAVE & NEXT"
          )}
        </button>
      </div>
    </div>
  );
};

export default SubmissionInfoCard;
