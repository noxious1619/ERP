import { useState, useEffect } from "react";
import {
  ChevronDown,
  AlignLeft,
  GraduationCap,
  ClipboardList,
} from "lucide-react";
import axios from "axios";

interface ClassOption {
  id: string;
  name: string;
}

interface AcademicYear {
  id: string;
  name: string;
  isCurrent?: boolean;
}

interface ConfigureStepProps {
  termName: string;
  title: string;
  setTitle: (val: string) => void;
  academicYear: string;
  setAcademicYear: (val: string) => void;
  reportingTime: string;
  setReportingTime: (val: string) => void;
  instructions: string;
  setInstructions: (val: string) => void;
  selectedClassId: string;
  setSelectedClassId: (val: string) => void;
  selectedClassName: string;
  setSelectedClassName: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function ConfigureStep({
  termName,
  title,
  setTitle,
  academicYear,
  setAcademicYear,
  instructions,
  setInstructions,
  selectedClassId,
  setSelectedClassId,
  setSelectedClassName,
  onBack,
  onNext,
}: ConfigureStepProps) {
  const [classes, setClasses] = useState<ClassOption[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYearId, setSelectedYearId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingClasses(true);

        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Since backend now defaults to current academic year,
        // we don't need to pass yearId.
        const [classRes, yearRes] = await Promise.all([
          axios.get("http://localhost:5000/api/academic/classes", {
            headers,
          }),
          axios.get("http://localhost:5000/api/academic/years", {
            headers,
          }),
        ]);

        if (classRes.data.success) {
          setClasses(classRes.data.data);
        }

        // Handle both response formats:
        // 1. { success: true, data: [...] }
        // 2. [...]
        const years = Array.isArray(yearRes.data)
          ? yearRes.data
          : yearRes.data.data || [];

        setAcademicYears(years);

        if (!academicYear && years.length > 0) {
          const current =
            years.find((y: AcademicYear) => y.isCurrent) ?? years[0];

          setAcademicYear(current.name);
          setSelectedYearId(current.id);
        }
      } catch (err: any) {
        console.error("Failed to fetch configuration data");

        console.error("Status:", err.response?.status);

        console.error("Message:", err.response?.data);

        setError(err.response?.data?.message || "Unable to load classes.");
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchData();
  }, []);
  const handleNext = () => {
    if (!selectedClassId) {
      setError("Please select a class.");
      return;
    }
    if (!title.trim()) {
      setError("Datesheet title is required.");
      return;
    }
    setError(null);
    onNext();
  };

  useEffect(() => {
    if (!selectedYearId) return;

    const fetchClasses = async () => {
      try {
        const token = localStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const res = await axios.get(
          "http://localhost:5000/api/academic/classes",
          {
            headers,
            params: {
              yearId: selectedYearId,
            },
          },
        );

        if (res.data.success) {
          setClasses(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchClasses();
  }, [selectedYearId]);

  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const cls = classes.find((c) => c.id === id);
    setSelectedClassId(id);
    setSelectedClassName(cls?.name ?? "");
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Datesheet Information Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="h-5 w-5 text-[#4285F4]" />
          <h3 className="font-bold text-gray-800 text-[14px]">
            Datesheet Information
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Datesheet Title — pre-filled from term name */}
          <div className="relative mt-1">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Datesheet Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={termName || "e.g. Mid Term 2026"}
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 bg-white transition"
            />
          </div>

          {/* Academic Year */}
          <div className="relative mt-1">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Academic Year <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <select
                value={selectedYearId}
                onChange={(e) => {
                  const year = academicYears.find(
                    (y) => y.id === e.target.value,
                  );

                  if (year) {
                    setSelectedYearId(year.id);
                    setAcademicYear(year.name);
                  }
                }}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 transition bg-white cursor-pointer appearance-none"
              >
                {academicYears.length > 0 ? (
                  academicYears.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name}
                    </option>
                  ))
                ) : (
                  <option value="">No Academic Year</option>
                )}
              </select>

              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Class & Instructions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Class Selection Card */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap className="h-5 w-5 text-[#4285F4]" />
            <h3 className="font-bold text-gray-800 text-[14px]">
              Applicable Class
            </h3>
          </div>

          <div className="relative mt-1">
            <label className="absolute -top-14 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Class <span className="text-red-500">*</span>
            </label>
            <div className="relative  -top-8">
              <select
                value={selectedClassId}
                onChange={handleClassChange}
                disabled={loadingClasses}
                className="w-full border border-gray-200  rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 transition bg-white cursor-pointer appearance-none disabled:opacity-50"
              >
                <option value="">
                  {loadingClasses ? "Loading classes..." : "Select a class"}
                </option>

                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {error && (
            <p className="mt-2 text-xs text-red-500 font-medium">{error}</p>
          )}
        </div>

        {/* Instructions Card */}
        <div className="border border-gray-200 rounded-xl p-5 bg-white flex flex-col min-h-[160px]">
          <div className="flex items-center gap-2 mb-4">
            <AlignLeft className="h-5 w-5 text-[#4285F4]" />
            <h3 className="font-bold text-gray-800 text-[14px]">
              Instructions
            </h3>
          </div>
          <div className="relative flex-1 flex flex-col">
            <label className="absolute -top-2 left-3.5 bg-white px-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider z-10">
              Instructions List
            </label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Candidates must bring admit cards. Calculators not allowed."
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-4 py-3.5 text-sm placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#4285F4] focus:border-[#4285F4] font-medium text-gray-800 transition resize-none"
            />
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-5 py-3 hover:bg-gray-50 text-gray-700 font-semibold text-sm rounded-xl border border-gray-200 transition bg-white cursor-pointer"
        >
          ← BACK
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 bg-[#4285F4] hover:bg-blue-600 text-white font-semibold text-xs rounded-lg transition shadow-md shadow-blue-500/10 cursor-pointer uppercase tracking-wider"
        >
          NEXT: SCHEDULE EXAMS →
        </button>
      </div>
    </div>
  );
}
