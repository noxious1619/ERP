// import { createContext, useState, useEffect } from "react";
// import type { ReactNode } from "react";
// import axios from "axios";

// export interface StudentProfile {
//   id: string;
//   admissionNumber: string;
//   rollNumber: string | null;
//   sectionId: string;
// }

// export interface TeacherProfile {
//   id: string;
//   firstName: string;
//   lastName: string;
//   // 🚀 Updated to perfectly match your Prisma schema relationships
//   classTeacherOf?: {
//     id: string;
//     name: string; // The Section Name (e.g., "Alpha")
//     academicClass: {
//       name: string; // The Class Name (e.g., "Grade 10")
//     };
//   } | null;
// }

// interface AuthContextType {
//   token: string | null;
//   role: string | null;
//   studentData: StudentProfile | null;
//   teacherData: TeacherProfile | null;
//   className: string | null;
//   sectionName: string | null;
//   sectionId: string | null;
//   loading: boolean;
//   logout: () => void;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined,
// );

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   // 1. Reading both from local storage
//   const [token] = useState<string | null>(localStorage.getItem("token"));
//   const [role] = useState<string | null>(localStorage.getItem("role"));

//   console.log("🔥 AuthProvider Mounted");
//   console.log("TOKEN:", token);
//   console.log("ROLE:", role);

//   const [studentData, setStudentData] = useState<StudentProfile | null>(null);
//   const [teacherData, setTeacherData] = useState<TeacherProfile | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const logout = () => {
//     localStorage.clear();
//     window.location.href = "/login";
//   };

//   useEffect(() => {
//     const hydrateSession = async () => {
//       if (!token || !role) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         const headers = { Authorization: `Bearer ${token}` };
//         console.log("ROLE FROM STORAGE:", role);

//         if (role === "STUDENT") {
//           console.log("📡 useAuth: Fetching student profile...");
//           const res = await axios.get("http://localhost:5000/api/students/me", {
//             headers,
//           });
//           if (res.data.success) {
//             console.log("✅ useAuth: Student profile resolved!", res.data.data);
//             setStudentData(res.data.data);
//           }
//         } else if (role === "TEACHER") {
//           console.log("📡 useAuth: Fetching teacher profile...");
//           const res = await axios.get("http://localhost:5000/api/teachers/me", {
//             headers,
//           });
//           if (res.data.success) {
//             console.log("✅ useAuth: Teacher profile resolved!", res.data.data);
//             setTeacherData(res.data.data);
//           }
//         }
//       } catch (err: any) {
//         console.error(
//           "❌ useAuth: Session restoration failed:",
//           err.response?.data?.message || err.message,
//         );
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     };

//     hydrateSession();
//   }, [token, role]);

//   const globalClassName =
//     teacherData?.classTeacherOf?.academicClass?.name || null;
//   const globalSectionName = teacherData?.classTeacherOf?.name || null;
//   const globalSectionId = teacherData?.classTeacherOf?.id || null;

//   return (
//     <AuthContext.Provider
//       value={{
//         token,
//         role,
//         studentData,
//         teacherData,
//         className: globalClassName,
//         sectionName: globalSectionName,
//         sectionId: globalSectionId,
//         loading,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };
import { createContext, useState, useEffect, type ReactNode } from "react";
import axios from "axios";

// ── Profile interfaces ────────────────────────────────────────────────────────

export interface StudentProfile {
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
  sectionId: string;
  section: {
    id: string;
    name: string;
    academicClass: {
      id: string;
      name: string;
    };
  };
}

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  classTeacherOf?: {
    id: string;
    name: string;
    academicClass: {
      id: string;
      name: string;
    };
  } | null;
  teachingAssignments: {
    id: string;
    subject: { id: string; name: string; code: string };
    section: {
      id: string;
      name: string;
      academicClass: { id: string; name: string };
    };
  }[];
}

// ── Expanded AdminProfile — User + Staff fields merged ────────────────────────
export interface AdminProfile {
  // User fields
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  // Staff fields (null if staff record not yet created)
  staffId: string | null;
  employeeId: string | null;
  firstName: string | null;
  lastName: string | null;
  gender: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  bloodGroup: string | null;
  department: string | null;
  designation: string | null;
  joiningDate: string | null;
  status: string | null;
  bio: string | null;
}

// ── Context type ──────────────────────────────────────────────────────────────

interface AuthContextType {
  token: string | null;
  role: string | null;
  studentData: StudentProfile | null;
  teacherData: TeacherProfile | null;
  adminData: AdminProfile | null;
  className: string | null;
  sectionName: string | null;
  sectionId: string | null;
  loading: boolean;
  logout: () => void;
}

// ── Context + Provider ────────────────────────────────────────────────────────

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  console.log("🚀 AuthProvider Rendered");
  const [token] = useState<string | null>(localStorage.getItem("token"));
  const [role] = useState<string | null>(localStorage.getItem("role"));

  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherProfile | null>(null);
  const [adminData, setAdminData] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const hydrateSession = async () => {
      if (!token || !role) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${token}` };

        if (role === "STUDENT") {
          const res = await axios.get("http://localhost:5000/api/students/me", {
            headers,
          });
          if (res.data.success) setStudentData(res.data.data);
        } else if (role === "TEACHER") {
          console.log("📡 Fetching teacher profile...");
          const res = await axios.get("http://localhost:5000/api/teachers/me", {
            headers,
          });
          console.log("Teacher API Response:", res.data);
          if (res.data.success) {
            console.log("✅ useAuth: Teacher profile resolved!", res.data.data);
            setTeacherData(res.data.data);
          }
        } else if (role === "ADMIN" || role === "SUPER_ADMIN") {
          console.log("📡 Fetching admin profile...");
          const res = await axios.get("http://localhost:5000/api/admin/me", {
            headers,
          });
          console.log("Admin API Response:", res.data);
          if (res.data.success) {
            console.log("✅ Admin profile resolved!", res.data.data);
            setAdminData(res.data.data);
          }
        }
      } catch (err: any) {
        console.error(
          "❌ useAuth: Session restoration failed:",
          err.response?.data?.message || err.message,
        );
        // Don't logout on API failure — only clear if 401 (invalid token)
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
      // } catch (err: any) {
      //   console.error(
      //     "❌ useAuth: Session restoration failed:",
      //     err.response?.data?.message || err.message,
      //   );
      //   logout();
      // } finally {
      //   setLoading(false);
      // }
    };

    hydrateSession();
  }, [token, role]);

  // Derived teacher convenience values — unchanged
  const globalClassName =
    teacherData?.classTeacherOf?.academicClass?.name || null;
  const globalSectionName = teacherData?.classTeacherOf?.name || null;
  const globalSectionId = teacherData?.classTeacherOf?.id || null;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        studentData,
        teacherData,
        adminData,
        className: globalClassName,
        sectionName: globalSectionName,
        sectionId: globalSectionId,
        loading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
