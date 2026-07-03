import { useState, useEffect } from "react";
import axios from "axios";
import { X, Eye, EyeOff } from "lucide-react";
import { API_BASE_URL } from "../../../../lib/api";

interface AddNewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  studentToEdit?: any | null;
  classes: any[];
}

const formatDate = (dateStr: any) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  } catch (e) {
    return "";
  }
};

function parseApiError(err: any): string {
  const backendMessage: string = err?.response?.data?.message || "";
  const backendError: string = err?.response?.data?.error || "";
  const combined = `${backendMessage} ${backendError}`.toLowerCase();

  if (
    combined.includes("unique constraint") ||
    combined.includes("already exists")
  ) {
    if (combined.includes("email")) {
      return "This email address is already registered. Please use a different email.";
    }
    if (
      combined.includes("admissionnumber") ||
      combined.includes("admission_number")
    ) {
      return "This admission number is already in use. Please use a different one.";
    }
    if (combined.includes("rollnumber") || combined.includes("roll_number")) {
      return "This roll number is already taken in the selected section.";
    }
    if (combined.includes("phonenumber") || combined.includes("phone_number")) {
      return "This contact number is already registered with another student.";
    }
    return "Some of the details you entered are already in use. Please check and try again.";
  }

  if (combined.includes("foreign key") || combined.includes("does not exist")) {
    return "The selected class or section is no longer valid. Please refresh and try again.";
  }

  if (combined.includes("invalid") && combined.includes("email")) {
    return "Please enter a valid email address.";
  }

  if (err?.response?.status === 401 || err?.response?.status === 403) {
    return "Your session has expired. Please log in again.";
  }

  if (!err?.response) {
    return "Could not connect to the server. Please check your connection and try again.";
  }

  if (
    backendMessage &&
    backendMessage.length < 120 &&
    !backendMessage.includes("\n") &&
    !backendMessage.includes("at ")
  ) {
    return backendMessage;
  }

  return "Something went wrong while saving the student's details. Please try again.";
}

export default function AddNewStudentModal({
  isOpen,
  onClose,
  onSuccess,
  studentToEdit = null,
  classes = [],
}: AddNewStudentModalProps) {
  const isEdit = !!studentToEdit;

  // Form Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Male");
  const [classId, setClassId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Dropdowns lists
  const [sections, setSections] = useState<any[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch sections when class changes
  useEffect(() => {
    if (!classId) {
      setSections([]);
      return;
    }

    const fetchSections = async () => {
      try {
        setIsLoadingSections(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/api/admin/subjects/classes/${classId}/sections`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        if (res.data.success) {
          setSections(res.data.data);
        }
      } catch (err: any) {
        console.error("Error fetching sections:", err);
      } finally {
        setIsLoadingSections(false);
      }
    };

    fetchSections();
  }, [classId]);

  // Auto-suggest password from roll number + admission number (new admissions only)
  useEffect(() => {
    if (isEdit) return;
    if (passwordTouched) return;
    if (rollNumber && admissionNumber) {
      setPassword(`Roll${rollNumber}@${admissionNumber}`);
    }
  }, [rollNumber, admissionNumber, isEdit, passwordTouched]);

  // Prefill states when editing
  useEffect(() => {
    if (studentToEdit) {
      setFirstName(studentToEdit.firstName || "");
      setLastName(studentToEdit.lastName || "");
      setEmail(studentToEdit.user?.email || studentToEdit.email || "");
      setPassword(""); // keep empty to not change unless typed
      setAdmissionNumber(studentToEdit.admissionNumber || "");
      setRollNumber(studentToEdit.rollNumber || "");
      setDateOfBirth(formatDate(studentToEdit.dateOfBirth));
      setGender(studentToEdit.gender || "Male");
      setClassId(studentToEdit.section?.classId || "");
      setSectionId(studentToEdit.sectionId || "");
      setPhoneNumber(studentToEdit.phoneNumber || "");
      setAddress(studentToEdit.address || "");
      setCity(studentToEdit.city || "");
      setState(studentToEdit.state || "");
      setBloodGroup(studentToEdit.bloodGroup || "");
      setFatherName(studentToEdit.parent?.fatherName || "");
      setFatherPhone(studentToEdit.parent?.fatherPhone || "");
      setMotherName(studentToEdit.parent?.motherName || "");
      setMotherPhone(studentToEdit.parent?.motherPhone || "");
      setParentEmail(studentToEdit.parent?.email || "");
      setIsActive(studentToEdit.isActive !== false);
      setErrorMsg("");
    } else {
      // Clear inputs
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPasswordTouched(false);
      setAdmissionNumber("");
      setRollNumber("");
      setDateOfBirth("");
      setGender("Male");
      setClassId("");
      setSectionId("");
      setPhoneNumber("");
      setAddress("");
      setCity("");
      setState("");
      setBloodGroup("");
      setFatherName("");
      setFatherPhone("");
      setMotherName("");
      setMotherPhone("");
      setParentEmail("");
      setIsActive(true);
      setErrorMsg("");
    }
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (
      !firstName ||
      !lastName ||
      !email ||
      !admissionNumber ||
      !dateOfBirth ||
      !gender ||
      !sectionId
    ) {
      setErrorMsg(
        "Please fill in all required fields (First/Last Name, Email, Admission No, DOB, Gender, and Section).",
      );
      return;
    }

    if (!isEdit && !password) {
      setErrorMsg("Password is required for onboarding a new student.");
      return;
    }

    if (!isEdit && password && password.length < 8) {
      setErrorMsg("Password must be at least 8 characters long.");
      return;
    }

    try {
      setIsSubmitting(true);
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const payload = {
        firstName,
        lastName,
        email,
        password,
        admissionNumber,
        rollNumber,
        dateOfBirth,
        gender,
        sectionId,
        phoneNumber,
        address,
        city,
        state,
        bloodGroup,
        fatherName,
        fatherPhone,
        motherName,
        motherPhone,
        parentEmail,

        isActive,
      };
      if (password) {
        payload.password = password;
      }

      if (isEdit) {
        const res = await axios.patch(
          `${API_BASE_URL}/api/students/${studentToEdit.id}`,
          payload,
          { headers },
        );
        if (res.data.success) {
          onSuccess();
        } else {
          setErrorMsg("Failed to update student profile.");
        }
      } else {
        const res = await axios.post(
          `${API_BASE_URL}/api/students/admit`,
          payload,
          { headers },
        );
        if (res.data.success) {
          onSuccess();
        } else {
          setErrorMsg("Failed to onboard student.");
        }
      }
    } catch (err: any) {
      setErrorMsg(parseApiError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl my-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? "Edit Student" : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0"></span>
              <span className="flex-1 leading-snug">{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Row 1: Name */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Row 2: Email & Admission Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@school.com"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Admission Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={admissionNumber}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                  placeholder="STD001"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            {/* Row 3: Roll Number & Password */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={rollNumber}
                  onChange={(e) => setRollNumber(e.target.value)}
                  placeholder="12"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Password {!isEdit && <span className="text-red-500">*</span>}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setPasswordTouched(true);
                    }}
                    placeholder={
                      isEdit ? "Leave blank to keep current" : "••••••••"
                    }
                    minLength={!isEdit || password ? 8 : undefined}
                    className="w-full rounded-lg border border-gray-200 bg-white p-2.5 pr-10 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required={!isEdit}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-400">
                  {isEdit
                    ? "Leave blank to keep the current password."
                    : password && !passwordTouched
                      ? "Auto-generated from roll number + admission number. You can edit it."
                      : "Minimum 8 characters."}
                </p>
              </div>
            </div>

            {/* Row 4: Class & Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Class <span className="text-red-500">*</span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => {
                    setClassId(e.target.value);
                    setSectionId("");
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  disabled={!classId || isLoadingSections}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">
                    {isLoadingSections
                      ? "Loading sections..."
                      : "Select Section"}
                  </option>
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 5: DOB & Gender */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* Row 6: Contact & Blood Group */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Phone number"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Blood Group
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
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

            {/* Row 7: Address */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street address details"
                className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Row 8: City & State */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Guardian Information */}
            <div className="border-t border-gray-200 pt-4 mt-2">
              <h3 className="text-base font-semibold text-gray-800 mb-3">
                Guardian Information
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Father Name
                </label>

                <input
                  type="text"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  placeholder="Father name"
                  className="w-full rounded-lg border border-gray-200 p-2.5"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Father Mobile
                </label>

                <input
                  type="text"
                  value={fatherPhone}
                  onChange={(e) => setFatherPhone(e.target.value)}
                  placeholder="Father mobile"
                  className="w-full rounded-lg border border-gray-200 p-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mother Name
                </label>

                <input
                  type="text"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  placeholder="Mother name"
                  className="w-full rounded-lg border border-gray-200 p-2.5"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Mother Mobile
                </label>

                <input
                  type="text"
                  value={motherPhone}
                  onChange={(e) => setMotherPhone(e.target.value)}
                  placeholder="Mother mobile"
                  className="w-full rounded-lg border border-gray-200 p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Parent Email
              </label>

              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                placeholder="parent@email.com"
                className="w-full rounded-lg border border-gray-200 p-2.5"
              />
            </div>

            {/* Row 9: Status */}
            {isEdit && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Account Status
                </label>
                <select
                  value={isActive ? "Active" : "Inactive"}
                  onChange={(e) => setIsActive(e.target.value === "Active")}
                  className="w-full rounded-lg border border-gray-200 bg-white p-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            )}

            {/* Hidden Submit for Enter Key */}
            <button type="submit" className="hidden" />
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : isEdit ? (
              "Save Changes"
            ) : (
              "Add Student"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
