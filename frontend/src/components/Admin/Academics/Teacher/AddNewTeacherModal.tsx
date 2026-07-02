import { useState, useEffect, useRef } from "react";
import { X, Plus } from "lucide-react";
import TeacherAssignmentCard, {
  type SubjectOption,
  type SectionOption,
  type TeacherAssignment,
} from "./Teacherassignmentcard";

interface AddNewTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EMPTY_ASSIGNMENT = (): TeacherAssignment => ({
  subjectId: "",
  classId: "",
  sectionIds: [],
  availableSections: [],
  loading: false,
});

const suggestedPassword = (id: string) => (id ? `${id}@123` : "");

export default function AddNewTeacherModal({
  isOpen,
  onClose,
  onSuccess,
}: AddNewTeacherModalProps) {
  // ── Personal fields ────────────────────────────────────────────────
  const [employeeId, setEmployeeId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const contactNumber = `+91 ${phoneDigits}`;
  const [gender, setGender] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [designation, setDesignation] = useState("Teacher");
  const [qualification, setQualification] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");

  // ── Password field ─────────────────────────────────────────────────
  const [password, setPassword] = useState("");
  const passwordTouchedRef = useRef(false);

  // ── Assignment fields ──────────────────────────────────────────────
  const [subjects, setSubjects] = useState<SubjectOption[]>([]);
  const [assignments, setAssignments] = useState<TeacherAssignment[]>([
    EMPTY_ASSIGNMENT(),
  ]);

  // ── UI state ───────────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch subjects when modal opens
  useEffect(() => {
    if (!isOpen) return;
    fetch("http://localhost:5000/api/academic/subjects", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setSubjects(json.data);
      })
      .catch(console.error);
  }, [isOpen]);

  // Auto-fill password from Employee ID unless admin has typed their own
  useEffect(() => {
    if (!passwordTouchedRef.current) {
      setPassword(suggestedPassword(employeeId));
    }
  }, [employeeId]);

  const handlePasswordChange = (val: string) => {
    passwordTouchedRef.current = true;
    setPassword(val);
  };

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setSuccess(false);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // ── Helpers ────────────────────────────────────────────────────────

  const resetForm = () => {
    setEmployeeId("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneDigits("");
    setGender("");
    setBloodGroup("");
    setDob("");
    setJoiningDate("");
    setDesignation("Teacher");
    setQualification("");
    setSpecialization("");
    setExperience("");
    setBio("");
    setAddress("");
    setCity("");
    setStateVal("");
    setPassword("");
    passwordTouchedRef.current = false;
    setAssignments([EMPTY_ASSIGNMENT()]);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let hasMissing = false;

    if (!employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
      hasMissing = true;
    }
    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
      hasMissing = true;
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      hasMissing = true;
    }
    if (!joiningDate) {
      newErrors.joiningDate = "Joining Date is required";
      hasMissing = true;
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
      hasMissing = true;
    } else if (password.trim().length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasMissing = true;
    }

    const cleanPhone = contactNumber.replace(/\s|-/g, "");
    if (!/^\+91\d{10}$/.test(cleanPhone))
      newErrors.contactNumber = "Must start with +91 and contain 10 digits";

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = "Please enter a valid email address";

    setErrors(newErrors);
    if (hasMissing) scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
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

  const handleContactChange = (val: string) => {
    // strip everything except digits
    let digits = val.replace(/\D/g, "");
    // if the user typed/pasted the "91" country code themselves, drop it
    if (val.trim().startsWith("+91") && digits.startsWith("91")) {
      digits = digits.slice(2);
    }
    // Indian mobile numbers are 10 digits
    digits = digits.slice(0, 10);
    setPhoneDigits(digits);
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
      const res = await fetch("http://localhost:5000/api/teachers/onboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          employeeId,
          gender,
          dateOfBirth: dob,
          phone: contactNumber,
          qualification,
          specialization,
          bio,
          experience: experience ? parseInt(experience) : undefined,
          joiningDate,
          designation,
          address,
          city,
          state: stateVal,
          bloodGroup,
          ...(validAssignments.length > 0 && { assignments: validAssignments }),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);

      resetForm();
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
          <h2 className="text-xl font-bold text-[#0a1c3a]">Add New Teacher</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="p-6 overflow-y-auto flex-1 overscroll-none"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Validation banner */}
            {Object.keys(errors).length > 0 && !errors.submit && !success && (
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
                Please fill in all required fields before submitting.
              </div>
            )}

            {/* Basic Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Employee ID *
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="Enter ID"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all ${
                    errors.employeeId
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                />
                {errors.employeeId && (
                  <span className="text-red-500 text-xs">
                    {errors.employeeId}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  First Name *
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Enter First Name"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all ${
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
                  placeholder="Enter Last Name"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all ${
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
                  placeholder="e.g. High School Teacher"
                  className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Contact Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Contact Number *
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => handleContactChange(e.target.value)}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none transition-all ${
                    errors.contactNumber
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                />
                {errors.contactNumber && (
                  <span className="text-red-500 text-xs">
                    {errors.contactNumber}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Email
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Email"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                />
                {errors.email && (
                  <span className="text-red-500 text-xs">{errors.email}</span>
                )}
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

            {/* Password Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Password *
                </label>
                <input
                  type="text"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Auto-generated from Employee ID"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all ${
                    errors.password
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                />
                {errors.password ? (
                  <span className="text-red-500 text-xs">
                    {errors.password}
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">
                    Auto-filled from Employee ID — you can edit it. Share this
                    with the teacher for first login.
                  </span>
                )}
              </div>
            </div>

            {/* Dates Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            </div>

            {/* Professional Info */}
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#0a1c3a]">
                  Teaching Assignments
                  <span className="ml-1.5 text-gray-400 font-normal">
                    (optional)
                  </span>
                </h3>
              </div>

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
                  placeholder="Enter Full Address"
                  rows={2}
                  className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
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
                    placeholder="Enter City"
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                    placeholder="Enter State"
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                placeholder="Enter brief bio/summary"
                rows={3}
                className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
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
                    Teacher added successfully!
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 cursor-pointer text-center transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white hover:bg-blue-600 cursor-pointer shadow-sm text-center transition-colors"
                  >
                    Add New Teacher
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
