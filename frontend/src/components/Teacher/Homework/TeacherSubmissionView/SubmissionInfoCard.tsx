import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Grade = "Complete" | "Incomplete" | "Wrong" | null;

const SUBMISSION_IMAGES = [
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
  "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800",
  "https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=800",
  "https://images.unsplash.com/photo-1544531585-9847b68c8c86?w=800",
  "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800",
];

const SubmissionInfoCard = () => {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedGrade, setSelectedGrade] = useState<Grade>(null);
  const [marks, setMarks] = useState("");
  const [saved, setSaved] = useState(false);

  const handlePrev = () =>
    setActiveImage(
      (i) => (i - 1 + SUBMISSION_IMAGES.length) % SUBMISSION_IMAGES.length,
    );
  const handleNext = () =>
    setActiveImage((i) => (i + 1) % SUBMISSION_IMAGES.length);

  const handleSave = () => {
    if (!selectedGrade) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
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
    <div className="flex flex-col h-full">
      {/* ── Banner carousel ── */}
      <div className="relative w-full h-[210px] shrink-0 overflow-hidden bg-gray-900">
        {/* Image */}
        <img
          src={SUBMISSION_IMAGES[activeImage]}
          alt={`Submission page ${activeImage + 1}`}
          className="w-full h-full object-cover transition-opacity duration-200"
        />

        {/* Dark gradient overlay so buttons are always visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40 pointer-events-none" />

        {/* Page counter — top right */}
        <div className="absolute top-3 right-3 bg-black/50 text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
          {activeImage + 1}/{SUBMISSION_IMAGES.length}
        </div>

        {/* Prev chevron */}
        <button
          onClick={handlePrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4 text-gray-700" />
        </button>

        {/* Next chevron */}
        <button
          onClick={handleNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white shadow flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4 text-gray-700" />
        </button>

        {/* Dot indicators — bottom center */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {SUBMISSION_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`rounded-full transition-all ${
                i === activeImage
                  ? "w-4 h-[6px] bg-white"
                  : "w-[6px] h-[6px] bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex flex-col gap-[18px] px-6 pt-5 pb-7 flex-1">
        {/* Student name + class */}
        <div>
          <h2 className="text-[24px] font-bold text-gray-900 leading-snug">
            Prince Sharma
          </h2>
          <p className="text-[13px] text-gray-400 mt-0.5">
            Class - X(A) &nbsp;•&nbsp; Roll no: 25
          </p>
        </div>

        {/* Date */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center rounded-[10px] border border-gray-200 overflow-hidden w-[44px] shadow-sm shrink-0">
            <div className="w-full bg-[#4285F4] text-white text-[9px] font-bold text-center py-[3px] tracking-widest">
              MAY
            </div>
            <div className="text-[17px] font-extrabold text-gray-800 leading-none py-[5px]">
              22
            </div>
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-800">
              Monday, May 21
            </p>
            <p className="text-[12px] text-gray-500 mt-0.5">10:25 PM</p>
          </div>
        </div>

        {/* Description */}
        <div className="rounded-[12px] bg-[#F5F8FF] px-4 py-3">
          <p className="text-[11px] text-gray-400 font-medium mb-1">
            Description
          </p>
          <p className="text-[13px] text-gray-700 leading-relaxed">
            Get your graph theory homework done quickly by focusing on these key
            graph concepts Get your graph theory homework done quickly by
            focusing on these concepts{" "}
            <button className="text-[#4D8DFF] font-semibold hover:underline">
              Read more...
            </button>
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
                  flex-1 h-[42px] rounded-full border-2 text-[12.5px] font-semibold transition-all
                  ${
                    selectedGrade === label
                      ? `${bgActive} ${textColor} ${borderActive}`
                      : `bg-white ${textColor} border-[#E4E7EC]`
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Marks — floating label */}
        <div className="relative">
          <label className="absolute -top-[9px] left-3 bg-white px-1 text-[11px] text-gray-400 font-medium z-10">
            Marks
          </label>
          <input
            type="text"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            placeholder="Eg. 30/50"
            className="w-full h-[50px] rounded-[12px] border border-gray-300 px-4 text-[13px] text-gray-700 placeholder-gray-300 outline-none focus:border-[#4D8DFF] transition-colors"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!selectedGrade}
          className={`
            w-full h-[52px] rounded-full text-[14px] font-bold tracking-widest
            transition-all mt-auto
            ${
              selectedGrade
                ? "bg-[#4D8DFF] text-white shadow-md hover:bg-[#3d7dee] active:scale-[0.98]"
                : "bg-white text-gray-300 border border-gray-200 cursor-not-allowed"
            }
          `}
        >
          {saved ? "SAVED ✓" : "SAVE & NEXT"}
        </button>
      </div>
    </div>
  );
};

export default SubmissionInfoCard;
