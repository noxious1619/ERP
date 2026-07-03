import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, CalendarDays, BadgeCheck } from "lucide-react";
import AdminSidebar from "../../../components/Admin/sidebar";
import AdminNavbar from "../../../components/Admin/Navbar";
import { API_BASE_URL } from "../../../lib/api";

interface AcademicYear {
  id: string;
  name: string;
  isCurrent: boolean;
  createdAt: string;
}

export default function AcademicYears() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [yearName, setYearName] = useState("");
  const [isCurrent, setIsCurrent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const token = localStorage.getItem("token");

  const fetchYears = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/academic/years`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setYears(data ?? []);
    } catch (err) {
      console.error("Failed to fetch years", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  // Scroll lock
  useEffect(() => {
    if (isModalOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isModalOpen]);

  useEffect(() => {
    const handleScroll = (e: Event) => e.preventDefault();
    const wrapper = wrapperRef.current;
    if (isModalOpen && wrapper) {
      wrapper.addEventListener("wheel", handleScroll, { passive: false });
      wrapper.addEventListener("touchmove", handleScroll, { passive: false });
    }
    return () => {
      if (wrapper) {
        wrapper.removeEventListener("wheel", handleScroll);
        wrapper.removeEventListener("touchmove", handleScroll);
      }
    };
  }, [isModalOpen]);

  const openModal = () => {
    setYearName("");
    setIsCurrent(false);
    setFormError(null);
    setFormSuccess(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!yearName.trim()) {
      setFormError("Year name is required.");
      return;
    }

    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/academic/years`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: yearName.trim(),
          isCurrent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Failed to create academic year.");
        return;
      }

      setFormSuccess("Academic year added successfully!");
      fetchYears();
      setTimeout(() => setIsModalOpen(false), 1200);
    } catch (err) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const currentYear = years.find((y) => y.isCurrent);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <AdminSidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminNavbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto w-full flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Academic Years
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your school's academic years
                </p>
              </div>
              <button
                onClick={openModal}
                className="bg-[#4285F4] hover:bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition shadow-sm cursor-pointer self-start sm:self-auto"
              >
                + Add Academic Year
              </button>
            </div>

            {/* Current Year Banner */}
            {currentYear && (
              <div className="bg-blue-50 border border-blue-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                <BadgeCheck className="h-5 w-5 text-blue-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                    Current Academic Year
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {currentYear.name}
                  </p>
                </div>
              </div>
            )}

            {/* Years List */}
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-gray-400 text-sm">Loading...</p>
              </div>
            ) : years.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 gap-2">
                <CalendarDays className="h-8 w-8 text-gray-300" />
                <p className="text-gray-400 text-sm">
                  No academic years found. Add one to get started.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {years.map((year) => (
                  <div
                    key={year.id}
                    className={`bg-white rounded-2xl border px-6 py-4 flex items-center justify-between shadow-sm transition
                      ${year.isCurrent ? "border-blue-300" : "border-gray-200"}`}
                  >
                    <div className="flex items-center gap-3">
                      <CalendarDays
                        className={`h-5 w-5 ${year.isCurrent ? "text-blue-500" : "text-gray-400"}`}
                      />
                      <div>
                        <p
                          className={`text-base font-bold ${year.isCurrent ? "text-blue-700" : "text-gray-900"}`}
                        >
                          {year.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Created{" "}
                          {new Date(year.createdAt).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>

                    {year.isCurrent ? (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
                        Current
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 px-3 py-1.5">
                        Inactive
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Year Modal */}
      {isModalOpen && (
        <div
          ref={wrapperRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overscroll-none"
        >
          <div
            className="absolute inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-[28px] bg-[#f8fafd] p-6 shadow-2xl z-10 flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0a1c3a]">
                Add Academic Year
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-6 w-6 stroke-[2.5]" />
              </button>
            </div>

            {/* Success */}
            {formSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                {formSuccess}
              </div>
            )}

            {/* Error */}
            {formError && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {formError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Year Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={yearName}
                  onChange={(e) => setYearName(e.target.value)}
                  placeholder="e.g. 2027-28"
                  className="w-full rounded-2xl border border-gray-200/80 bg-white px-4 py-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Set as Current checkbox */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setIsCurrent(!isCurrent)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer
                    ${isCurrent ? "bg-[#4285F4] border-[#4285F4]" : "border-gray-300 bg-white"}`}
                >
                  {isCurrent && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0a1c3a]">
                    Set as current year
                  </p>
                  <p className="text-xs text-gray-400">
                    This will unset the previous current year
                  </p>
                </div>
              </label>

              <div className="flex gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !!formSuccess}
                  className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors cursor-pointer shadow-sm disabled:opacity-60"
                >
                  {formLoading ? "Adding..." : "Add Year"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
