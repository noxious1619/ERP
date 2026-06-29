import {  X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import useAuth from "../../../../hooks/useAuth";
interface AddNewStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
export default function AddNewStaffModal({
  isOpen,
  onClose,
  onSuccess,
}: AddNewStaffModalProps) {
  const [employeeId, setEmployeeId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");
  const [classAssigned, setClassAssigned] = useState("");
  const [contactNumber, setContactNumber] = useState("+91 ");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [qualification, setQualification] = useState("");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const submitErrorRef = useRef<HTMLDivElement>(null);
  const [hasRequiredFieldError, setHasRequiredFieldError] = useState(false);
  const { role: userRole } = useAuth();
  const isSuperAdmin = userRole === "SUPER_ADMIN";

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

  const handleContactChange = (val: string) => {
    if (!val.startsWith("+91")) {
      setContactNumber("+91 ");
    } else {
      setContactNumber(val);
    }
  };

  const resetForm = () => {
    setEmployeeId("");
    setFirstName("");
    setLastName("");
    setRole("");
    setSubject("");
    setClassAssigned("");
    setContactNumber("+91 ");
    setEmail("");
    setGender("");
    setDob("");
    setJoiningDate("");
    setQualification("");
    setExperience("");
    setAddress("");
    setCity("");
    setStateVal("");
    setBloodGroup("");
    setBio("");
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    let missingRequiredField = false;

    if (!employeeId.trim()) {
      newErrors.employeeId = "Employee ID is required";
      missingRequiredField = true;
    }

    if (!firstName.trim()) {
      newErrors.firstName = "First Name is required";
      missingRequiredField = true;
    }

    if (!lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      missingRequiredField = true;
    }

    if (!role) {
      newErrors.role = "Role selection is required";
      missingRequiredField = true;
    }

    if (!joiningDate) {
      newErrors.joiningDate = "Joining Date is required";
      missingRequiredField = true;
    }

    const cleanPhone = contactNumber.replace(/\s|-/g, "");
    const phoneRegex = /^\+91\d{10}$/;

    if (!phoneRegex.test(cleanPhone)) {
      newErrors.contactNumber =
        "Contact number must start with +91 and contain exactly 10 digits";
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email.trim())) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    setHasRequiredFieldError(missingRequiredField);
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      requestAnimationFrame(() => {
        scrollContainerRef.current?.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });

      return;
    }

    try {
      const isTeacher = role === "Teacher";

      const endpoint = isTeacher
        ? "http://localhost:5000/api/teachers/onboard"
        : "http://localhost:5000/api/staff/onboard";

      const body = isTeacher
        ? {
            firstName,
            lastName,
            email,
            password: "EdaOS@123",
            employeeId,
            gender,
            dateOfBirth: dob,
            phone: contactNumber,
            qualification,
            bio,
            experience: experience ? parseInt(experience) : undefined,
            joiningDate,
            address,
            city,
            state: stateVal,
            bloodGroup,
          }
        : {
            firstName,
            lastName,
            email,
            password: "EdaOS@123",
            employeeId,
            role,
            gender,
            dateOfBirth: dob,
            qualification,
            experience: experience ? parseInt(experience, 10) : undefined,
            phone: contactNumber,
            joiningDate,
            address,
            city,
            state: stateVal,
            bloodGroup,
            bio,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message);
      }

      resetForm();
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        onClose();
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setErrors({ submit: err.message });

      requestAnimationFrame(() => {
        submitErrorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overflow-y-auto overscroll-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl rounded-[28px] bg-[#f8fafd] shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 bg-white rounded-t-[28px]">
          <h2 className="text-xl font-bold text-[#0a1c3a] font-sans">
            Add New Staff
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Content Form */}
        <div
          ref={scrollContainerRef}
          className="p-6 overflow-y-auto flex-1 overscroll-none"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Validation summary — shows when form submitted with errors */}
            {hasRequiredFieldError && !errors.submit && !success && (
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
            {/* Basic Info Row */}
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
                  Employee First Name *
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
                  Employee Last Name *
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
                  Role *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none transition-all appearance-none cursor-pointer ${
                    errors.role
                      ? "border-red-500 focus:ring-2 focus:ring-red-500/20"
                      : "border-gray-200/80 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select Role</option>
                  {isSuperAdmin && <option value="Admin">Admin</option>}
                  <option value="Finance">Finance</option>
                  <option value="Principal">Principal</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
                {errors.role && (
                  <span className="text-red-500 text-xs">{errors.role}</span>
                )}
              </div>
            </div>

            {/* Contact & Demographics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Contact Number *
                </label>
                <input
                  type="text"
                  value={contactNumber}
                  onChange={(e) => handleContactChange(e.target.value)}
                  placeholder="Enter Contact Number"
                  className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none transition-all ${
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
                  placeholder="Enter Email Address"
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
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            {/* Dates & Academics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  Subject Assigned (if applicable)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter Subject"
                  className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-[#0a1c3a]">
                  Class Assigned (if applicable)
                </label>
                <input
                  type="text"
                  value={classAssigned}
                  onChange={(e) => setClassAssigned(e.target.value)}
                  placeholder="Enter Class"
                  className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Professional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  Experience
                </label>
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g. 5 years"
                  className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Geographical Info */}
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

            {/* Error message */}
            {errors.submit && (
              <div
                ref={submitErrorRef}
                className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600"
              >
                {errors.submit}
              </div>
            )}

            {/* Photo Attachment (Static visual component) */}
            {/* <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-[#0a1c3a]">
                Add Photo
              </label>
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 transition-colors hover:bg-gray-50">
                <Upload className="mb-2 h-8 w-8 text-gray-400" />
                <p className="text-sm text-gray-500 mb-1">
                  PDFs, Images, or Links
                </p>
                <p className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
              </div>
              <button
                type="button"
                className="mt-2 flex items-center gap-1.5 text-sm font-medium text-[#4285F4] hover:text-blue-600"
              >
                <LinkIcon className="h-4 w-4" />
                Add Link
              </button>
            </div> */}

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
                    Staff member added successfully!
                  </span>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700 cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-2xl bg-[#4285F4] py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 cursor-pointer shadow-sm text-center"
                  >
                    Add New Staff
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
