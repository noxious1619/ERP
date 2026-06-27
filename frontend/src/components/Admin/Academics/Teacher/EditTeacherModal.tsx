import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import TeacherAssignmentCard, {
  type SubjectOption,
  type SectionOption,
  type TeacherAssignment,
} from "./Teacherassignmentcard";

interface EditTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  teacherId: string | null;
}

const EMPTY_ASSIGNMENT = (): TeacherAssignment => ({
  subjectId: "",
  classId: "",
  sectionIds: [],
  availableSections: [],
  loading: false,
});

export default function EditTeacherModal({
  isOpen,
  onClose,
  onSuccess,
  teacherId,
}: EditTeacherModalProps) {
  // ── Personal fields ────────────────────────────────────────────────
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [designation, setDesignation] = useState("");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [status, setStatus] = useState("");

  // ── Assignment fields ──────────────────────────────────────────────
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([
    EMPTY_ASSIGNMENT(),
  ]);

  // ── UI state ───────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch teacher data + subjects when modal opens
  useEffect(() => {
    if (!isOpen || !teacherId) return;

    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    // Fetch subjects first, then teacher (so we can hydrate sections)
    const loadAll = async () => {
      setFetching(true);
      try {
        const [subjectsRes, teacherRes] = await Promise.all([
          fetch("http://localhost:5000/api/academic/subjects", { headers }),
          fetch(`http://localhost:5000/api/teachers/${teacherId}`, { headers }),
        ]);

        const subjectsJson = await subjectsRes.json();
        const teacherJson = await teacherRes.json();

        if (!teacherJson.success) throw new Error(teacherJson.message);

        const allSubjects: SubjectOption[] = subjectsJson.success
          ? subjectsJson.data
          : [];
        setSubjects(allSubjects);

        const t = teacherJson.data;

        // Personal fields
        setFirstName(t.firstName ?? "");
        setLastName(t.lastName ?? "");
        setGender(t.gender ?? "");
        setDob(
          t.dateOfBirth
            ? new Date(t.dateOfBirth).toISOString().split("T")[0]
            : "",
        );
        setContactNumber(t.phone ?? "");
        setEmail(t.email ?? "");
        setBloodGroup(t.bloodGroup ?? "");
        setJoiningDate(
          t.joiningDate
            ? new Date(t.joiningDate).toISOString().split("T")[0]
            : "",
        );
        setDesignation(t.designation ?? "");
        setQualification(t.qualification ?? "");
        setSpecialization(t.specialization ?? "");
        setExperience(t.experience != null ? String(t.experience) : "");
        setBio(t.bio ?? "");
        setAddress(t.address ?? "");
        setCity(t.city ?? "");
        setStateVal(t.state ?? "");
        setStatus(t.status ?? "ACTIVE");

        // =============================
        // Convert teachingAssignments
        // =============================
        const groupedAssignments = new Map<
          string,
          {
            subjectId: string;
            classId: string;
            sectionIds: string[];
          }
        >();

        for (const ta of t.teachingAssignments ?? []) {
          const subjectId = ta.subject.id;
          const classId = ta.section.academicClass.id;

          if (!groupedAssignments.has(subjectId)) {
            groupedAssignments.set(subjectId, {
              subjectId,
              classId,
              sectionIds: [],
            });
          }

          groupedAssignments.get(subjectId)!.sectionIds.push(ta.section.id);
        }

        const hydrated = await Promise.all(
          [...groupedAssignments.values()].map(async (assignment) => {
            try {
              const res = await fetch(
                `http://localhost:5000/api/academic/sections?classId=${assignment.classId}`,
                { headers },
              );

              const json = await res.json();

              return {
                subjectId: assignment.subjectId,
                classId: assignment.classId,
                sectionIds: assignment.sectionIds,
                availableSections: json.success ? json.data : [],
                loading: false,
              };
            } catch {
              return {
                subjectId: assignment.subjectId,
                classId: assignment.classId,
                sectionIds: assignment.sectionIds,
                availableSections: [],
                loading: false,
              };
            }
          }),
        );

        setAssignments(hydrated.length > 0 ? hydrated : [EMPTY_ASSIGNMENT()]);
      } catch (err: any) {
        setErrors({ submit: err.message });
      } finally {
        setFetching(false);
      }
    };

    loadAll();
  }, [isOpen, teacherId]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSuccess(false);
      setErrors({});
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Validation ─────────────────────────────────────────────────────
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!joiningDate) newErrors.joiningDate = "Joining Date is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0)
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    return Object.keys(newErrors).length === 0;
  };

  // ── Assignment handlers ────────────────────────────────────────────
  const handleSubjectChange = async (index: number, subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);

    setAssignments((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...a,
              subjectId,
              classId: subject?.classId ?? "",
              sectionIds: [],
              availableSections: [],
              loading: !!subjectId,
            }
          : a,
      ),
    );

    if (!subjectId || !subject) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/academic/sections?classId=${subject.classId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const json = await res.json();
      const sections: SectionOption[] = json.success ? json.data : [];
      setAssignments((prev) =>
        prev.map((a, i) =>
          i === index
            ? { ...a, availableSections: sections, loading: false }
            : a,
        ),
      );
    } catch {
      setAssignments((prev) =>
        prev.map((a, i) =>
          i === index ? { ...a, availableSections: [], loading: false } : a,
        ),
      );
    }
  };

  const handleSectionToggle = (index: number, sectionId: string) => {
    setAssignments((prev) =>
      prev.map((a, i) =>
        i === index
          ? {
              ...a,
              sectionIds: a.sectionIds.includes(sectionId)
                ? a.sectionIds.filter((s) => s !== sectionId)
                : [...a.sectionIds, sectionId],
            }
          : a,
      ),
    );
  };

  const addAssignment = () =>
    setAssignments((prev) => [...prev, EMPTY_ASSIGNMENT()]);

  const removeAssignment = (index: number) =>
    setAssignments((prev) => prev.filter((_, i) => i !== index));

  // ── Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const validAssignments = assignments
      .filter((a) => a.subjectId && a.sectionIds.length > 0)
      .map((a) => ({ subjectId: a.subjectId, sectionIds: a.sectionIds }));

    try {
      const res = await fetch(
        `http://localhost:5000/api/teachers/${teacherId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            firstName,
            lastName,
            gender,
            dateOfBirth: dob,
            phone: contactNumber,
            email,
            bloodGroup,
            joiningDate,
            designation,
            qualification,
            specialization,
            experience: experience ? parseInt(experience) : undefined,
            bio,
            address,
            city,
            state: stateVal,
            status,
            assignments: validAssignments,
          }),
        },
      );
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setErrors({ submit: err.message });
    }
  };

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overflow-y-auto overscroll-none">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-4xl rounded-[28px] bg-[#f8fafd] shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 bg-white rounded-t-[28px]">
          <div>
            <h2 className="text-xl font-bold text-[#0a1c3a]">Edit Teacher</h2>
            {designation && (
              <p className="text-sm text-gray-500 mt-0.5">{designation}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="p-6 overflow-y-auto flex-1 overscroll-none"
        >
          {fetching ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {Object.keys(errors).length > 0 && !errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                  <svg
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
                    />
                  </svg>
                  Please fill in all required fields.
                </div>
              )}

              {/* Name + Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none transition-all ${
                      errors.firstName
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {errors.firstName && (
                    <span className="text-red-500 text-xs">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none transition-all ${
                      errors.lastName
                        ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                        : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {errors.lastName && (
                    <span className="text-red-500 text-xs">
                      {errors.lastName}
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="ON_LEAVE">On Leave</option>
                  </select>
                </div>
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Contact Number
                  </label>
                  <input
                    type="text"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Email
                  </label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Dates + Blood Group */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Joining Date *
                  </label>
                  <input
                    type="date"
                    value={joiningDate}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    className={`w-full rounded-xl border bg-white px-4 py-2 text-sm text-gray-800 focus:outline-none focus:ring-2 transition-all ${
                      errors.joiningDate
                        ? "border-red-500 focus:ring-red-500/20"
                        : "border-gray-200/80 focus:ring-blue-500/20 focus:border-blue-500"
                    }`}
                  />
                  {errors.joiningDate && (
                    <span className="text-red-500 text-xs">
                      {errors.joiningDate}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Blood Group
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Blood Group</option>
                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                      (bg) => (
                        <option key={bg} value={bg}>
                          {bg}
                        </option>
                      ),
                    )}
                  </select>
                </div>
              </div>

              {/* Professional */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Qualification
                  </label>
                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    placeholder="e.g. B.Ed, M.Sc"
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Specialization
                  </label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="e.g. Mathematics"
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Experience (years)
                  </label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    placeholder="e.g. 5"
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              {/* Teaching Assignments */}
              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-semibold text-[#0a1c3a]">
                  Teaching Assignments
                </h3>

                {assignments.map((assignment, index) => (
                  <TeacherAssignmentCard
                    key={index}
                    index={index}
                    assignment={assignment}
                    subjects={subjects}
                    canRemove={assignments.length > 1}
                    onSubjectChange={handleSubjectChange}
                    onSectionToggle={handleSectionToggle}
                    onRemove={removeAssignment}
                  />
                ))}

                <button
                  type="button"
                  onClick={addAssignment}
                  className="flex items-center gap-2 text-sm font-semibold text-blue-500 hover:text-blue-600 transition-colors self-start px-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Subject
                </button>
              </div>

              {/* Address */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#0a1c3a]">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-[#0a1c3a]">
                      State
                    </label>
                    <input
                      type="text"
                      value={stateVal}
                      onChange={(e) => setStateVal(e.target.value)}
                      className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {errors.submit}
                </div>
              )}

              {/* Footer */}
              <div className="border-t border-gray-100 pt-5 flex gap-4 mt-3">
                {success ? (
                  <div className="flex-1 flex items-center justify-center gap-3 rounded-2xl bg-green-50 border border-green-200 py-3.5">
                    <svg
                      className="h-5 w-5 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-sm font-semibold text-green-700">
                      Teacher updated successfully!
                    </span>
                  </div>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer text-center transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer shadow-sm text-center transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
