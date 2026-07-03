"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { API_BASE_URL } from "../../../../lib/api";

function FilterSelect({
  label,
  options,
  onChange,
  value,
}: {
  label: string;
  options: { value: string; label: string }[];
  onChange: (val: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Only show the matched option's label when a real selection is made.
  // Empty value always falls back to the filter's own placeholder label.
  const displayLabel = value
    ? options.find((o) => o.value === value)?.label
    : label;

  const choose = (val: string) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 bg-white pl-3 pr-2.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{displayLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="absolute left-0 top-[calc(100%+6px)] z-50 max-h-64 min-w-[10rem] overflow-y-auto rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg">
          {options.map((opt) => (
            <li key={opt.value || "all"}>
              <button
                type="button"
                onClick={() => choose(opt.value)}
                className={`w-full whitespace-nowrap rounded-lg px-3 py-1.5 text-left text-sm transition-colors ${
                  value === opt.value
                    ? "bg-blue-50 font-medium text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: "", label: "All" },
  { value: "Active", label: "Active" },
  { value: "On Leave", label: "On Leave" },
];

const GENDER_OPTIONS = [
  { value: "", label: "All" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

interface TeacherFiltersProps {
  onStatusChange: (val: string) => void;
  onGenderChange: (val: string) => void;
  onClassChange: (val: string) => void;
  onSubjectChange: (val: string) => void;
}

export default function TeacherFilters({
  onStatusChange,
  onGenderChange,
  onClassChange,
  onSubjectChange,
}: TeacherFiltersProps) {
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  const [classOptions, setClassOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "All" }]);
  const [subjectOptions, setSubjectOptions] = useState<
    { value: string; label: string }[]
  >([{ value: "", label: "All" }]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Confirmed mount path from server.ts: app.use('/api/academic', academicRoutes)
    fetch(`${API_BASE_URL}/api/academic/classes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setClassOptions([
            { value: "", label: "All" },
            ...json.data.map((c: { id: string; name: string }) => ({
              value: c.id,
              label: c.name,
            })),
          ]);
        }
      })
      .catch(() => {});

    fetch(`${API_BASE_URL}/api/academic/subjects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) {
          setSubjectOptions([
            { value: "", label: "All" },
            ...json.data.map((s: { id: string; name: string }) => ({
              value: s.id,
              label: s.name,
            })),
          ]);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <FilterSelect
        label="All Status"
        value={status}
        options={STATUS_OPTIONS}
        onChange={(v) => {
          setStatus(v);
          onStatusChange(v);
        }}
      />
      <FilterSelect
        label="All Gender"
        value={gender}
        options={GENDER_OPTIONS}
        onChange={(v) => {
          setGender(v);
          onGenderChange(v);
        }}
      />
      <FilterSelect
        label="All Class"
        value={classId}
        options={classOptions}
        onChange={(v) => {
          setClassId(v);
          onClassChange(v);
        }}
      />
      <FilterSelect
        label="All Subject"
        value={subjectId}
        options={subjectOptions}
        onChange={(v) => {
          setSubjectId(v);
          onSubjectChange(v);
        }}
      />
    </div>
  );
}
