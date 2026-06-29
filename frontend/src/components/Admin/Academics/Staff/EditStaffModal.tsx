import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  staffId: string | null;
}

export default function EditStaffModal({
  isOpen,
  onClose,
  onSuccess,
  staffId,
}: EditStaffModalProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("");
  const [dob, setDob] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [bio, setBio] = useState("");
  const [status, setStatus] = useState("");
  const [designation, setDesignation] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [fetching, setFetching] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch existing staff data when modal opens
  useEffect(() => {
    if (!isOpen || !staffId) return;

    const fetchStaff = async () => {
      setFetching(true);
      try {
        const res = await fetch(`http://localhost:5000/api/staff/${staffId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const s = json.data;
        setFirstName(s.firstName ?? "");
        setLastName(s.lastName ?? "");
        setGender(s.gender ?? "");
        setDob(
          s.dateOfBirth
            ? new Date(s.dateOfBirth).toISOString().split("T")[0]
            : "",
        );
        setContactNumber(s.phone ?? "");
        setEmail(s.email ?? "");
        setBloodGroup(s.bloodGroup ?? "");
        setQualification(s.qualification ?? "");
        setExperience(
          s.experience !== null && s.experience !== undefined
            ? String(s.experience)
            : "",
        );
        setJoiningDate(
          s.joiningDate
            ? new Date(s.joiningDate).toISOString().split("T")[0]
            : "",
        );
        setAddress(s.address ?? "");
        setCity(s.city ?? "");
        setStateVal(s.state ?? "");
        setBio(s.bio ?? "");
        setStatus(s.status ?? "ACTIVE");
        setDesignation(s.designation ?? "");
      } catch (err: any) {
        setErrors({ submit: err.message });
      } finally {
        setFetching(false);
      }
    };

    fetchStaff();
  }, [isOpen, staffId]);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = "First Name is required";
    if (!lastName.trim()) newErrors.lastName = "Last Name is required";
    if (!joiningDate) newErrors.joiningDate = "Joining Date is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/staff/${staffId}`, {
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
          qualification,
          experience: experience ? parseInt(experience, 10) : null,
          phone: contactNumber,
          email,
          bloodGroup,
          joiningDate,
          address,
          city,
          state: stateVal,
          bio,
          status,
        }),
      });

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a1523]/35 backdrop-blur-[6px] p-4 overflow-y-auto overscroll-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl rounded-[28px] bg-[#f8fafd] shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 bg-white rounded-t-[28px]">
          <div>
            <h2 className="text-xl font-bold text-[#0a1c3a]">Edit Staff</h2>
            {designation && (
              <p className="text-sm text-gray-500 mt-0.5">{designation}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          >
            <X className="h-6 w-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Content */}
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
                  Please fill in all required fields.
                </div>
              )}

              {/* Name Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

              {/* Contact Row */}
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

              {/* Dates Row */}
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Qualification
                  </label>

                  <input
                    type="text"
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-[#0a1c3a]">
                    Experience (Years)
                  </label>

                  <input
                    type="number"
                    min={0}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-gray-200/80 bg-white px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                </div>
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

              {/* Error */}
              {errors.submit && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
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
                      Staff updated successfully!
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
