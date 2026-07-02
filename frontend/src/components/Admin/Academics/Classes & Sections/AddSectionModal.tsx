import { useState, useEffect, useRef } from "react";
import { X, CheckCircle } from "lucide-react";

interface SectionData {
  id: string;
  name: string;
  homeRoom: string | null;
  capacity: number;
  classTeacherId: string | null;
  classTeacherName: string;
  studentCount: number;
}

interface TeacherOption {
  id: string;
  name: string;
}

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string | null;
  onSuccess: () => void;
  editData?: SectionData | null;
}

export default function AddSectionModal({
  isOpen,
  onClose,
  classId,
  onSuccess,
  editData = null,
}: AddSectionModalProps) {
  const isEditMode = !!editData;

  const [sectionName, setSectionName] = useState("");
  const [homeRoom, setHomeRoom] = useState("");
  const [capacity, setCapacity] = useState("50");
  const [classTeacherId, setClassTeacherId] = useState("");
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setSectionName(editData.name);
        setHomeRoom(editData.homeRoom ?? "");
        setCapacity(String(editData.capacity));
        setClassTeacherId(editData.classTeacherId ?? "");
      } else {
        setSectionName("");
        setHomeRoom("");
        setCapacity("50");
        setClassTeacherId("");
      }
      setError(null);
      setSuccess(null);
    }
  }, [isOpen, editData]);

  // Fetch teacher list whenever the modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "http://localhost:5000/api/teachers?limit=1000",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();

        if (!res.ok) {
          console.error("Failed to fetch teachers:", res.status, data);
          return;
        }

        setTeachers(data.data ?? []);
      } catch (err) {
        console.error("Error fetching teachers:", err);
      }
    };

    fetchTeachers();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => e.preventDefault();
    const wrapper = wrapperRef.current;
    if (isOpen && wrapper) {
      wrapper.addEventListener("wheel", handleScroll, { passive: false });
      wrapper.addEventListener("touchmove", handleScroll, { passive: false });
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener("wheel", handleScroll);
        wrapper.removeEventListener("touchmove", handleScroll);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sectionName.trim()) {
      setError("Section name is required.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");

      const url = isEditMode
        ? `http://localhost:5000/api/academic/sections/${editData!.id}`
        : `http://localhost:5000/api/academic/sections`;

      const method = isEditMode ? "PATCH" : "POST";

      const body: any = {
        name: sectionName.trim(),
        homeRoom: homeRoom.trim() || null,
        capacity: Number(capacity) || 50,
        classTeacherId: classTeacherId || null,
      };

      if (!isEditMode) body.classId = classId;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
        return;
      }

      setSuccess(
        isEditMode
          ? "Section updated successfully!"
          : "Section added successfully!",
      );
      onSuccess();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overscroll-none"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md rounded-[28px] bg-[#f8fafd] p-6 shadow-2xl z-10 flex flex-col gap-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#0a1c3a] font-sans">
            {isEditMode ? "Edit Section" : "Add New Section"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Success */}
        {success && (
          <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">
              Section Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={sectionName}
              onChange={(e) => setSectionName(e.target.value)}
              placeholder="e.g. A"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">
              Home Room
            </label>
            <input
              type="text"
              value={homeRoom}
              onChange={(e) => setHomeRoom(e.target.value)}
              placeholder="e.g. 101"
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">
              Capacity
            </label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              placeholder="50"
              min={1}
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#0a1c3a]">
              Class Teacher
            </label>
            <select
              value={classTeacherId}
              onChange={(e) => setClassTeacherId(e.target.value)}
              className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
              <option value="">Not Assigned</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!success}
              className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 cursor-pointer shadow-sm disabled:opacity-60"
            >
              {loading
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
