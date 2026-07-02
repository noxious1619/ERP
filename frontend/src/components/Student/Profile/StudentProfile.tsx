import { useEffect, useState } from "react";
import axios from "axios";
interface StudentProfileData {
  id: string;
  admissionNumber: string;
  rollNumber: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string | null;
  city: string | null;
  state: string | null;
  phoneNumber: string | null;
  bloodGroup: string | null;
  profileImage: string | null;
  section: {
    name: string;

    academicClass: {
      name: string;
    };
  };
}
const StudentProfile = () => {
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/students/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (response.data.success) {
          setStudent(response.data.data);

          console.log(
            "Student profile fetched successfully:",
            response.data.data,
          );
        } else {
          setError("Failed to fetch student profile.");
        }
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Error connecting to student server.",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchStudentProfile();
  }, []);
  // Loading State
  if (loading) {
    return (
      <div className="w-[460px] h-[900px] bg-white/40 rounded-3xl shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80 flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B4FE8]"></div>

        <span className="mt-3 text-sm font-medium text-gray-500">
          Syncing student profile...
        </span>
      </div>
    );
  }
  // Error State
  if (error) {
    return (
      <div className="w-[460px] bg-red-50 text-red-700 p-6 rounded-3xl text-sm font-medium border border-red-100">
        {error}
      </div>
    );
  }
  // No Data State
  if (!student) {
    return (
      <div className="w-[460px] bg-gray-50 text-gray-500 p-8 rounded-3xl text-center text-sm font-medium border border-dashed border-gray-200">
        No student profile data available.
      </div>
    );
  }
  const studentInfo = [
    {
      label: "UID",
      value: student.id,
    },
    {
      label: "ADM NO.",
      value: student.admissionNumber || "N/A",
    },
    {
      label: "PHONE",
      value: student.phoneNumber || "N/A",
    },
    {
      label: "GENDER",
      value: student.gender || "N/A",
    },
    {
      label: "DOB",
      value: new Date(student.dateOfBirth).toLocaleDateString("en-GB"),
    },
    {
      label: "BLOOD GRP.",
      value: student.bloodGroup || "N/A",
    },
    {
      label: "AREA",
      value: student.address || "N/A",
    },
    {
      label: "CITY",
      value: student.city || "N/A",
    },
    {
      label: "STATE",
      value: student.state || "N/A",
    },
  ];
  return (
    <div className="w-[460px] bg-white/40 rounded-3xl shadow-[0px_4px_88px_0px_rgba(0,0,0,0.05)] border-[0.50px] border-stone-300/80 px-12 py-8 backdrop-blur-[2px]">
      {/* Student Image */}
      {/* Student Initials Avatar */}
      <div className="flex justify-center">
        <div className="h-[100px] w-[100px] rounded-2xl bg-gradient-to-br from-[#E4E1FB] to-[#F3E9FB] flex items-center justify-center">
          <span className="text-[36px] font-bold text-[#7C6EF2]">
            {student.firstName?.[0]?.toUpperCase() || ""}
            {student.lastName?.[0]?.toUpperCase() || ""}
          </span>
        </div>
      </div>

      {/* Name */}
      <h2 className="mt-2 text-center text-[26px] font-black uppercase tracking-[-0.5px] text-black">
        {student.firstName} {student.lastName}
      </h2>

      {/* Class + Roll */}
      <div className="mt-5 flex items-center justify-center gap-12">
        <p className="text-[16px] font-medium text-[#1D1D1D]">
          Class - {student.section?.academicClass?.name?.replace("Class ", "")}{" "}
          {student.section?.name?.replace("Section ", "")}
        </p>

        <p className="text-[16px] font-medium text-[#1D1D1D]">
          Roll no- {student.rollNumber || "N/A"}
        </p>
      </div>

      {/* Information */}
      <div className="mt-12 flex flex-col gap-8">
        {studentInfo.map((item) => (
          <div
            key={item.label}
            className="grid grid-cols-[82px_1fr] items-start gap-8"
          >
            {/* Label */}
            <span className="text-[18px] font-medium uppercase tracking-[0.5px] text-[#767676]">
              {item.label}
            </span>

            {/* Value */}
            <p className="text-[20px] font-semibold leading-[28px] text-black break-words">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentProfile;
