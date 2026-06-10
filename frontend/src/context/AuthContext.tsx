import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface StudentProfile {
  id: string;
  admissionNumber: string;
  rollNumber: string | null;
  sectionId: string;
}

export interface TeacherProfile {
  id: string;
  firstName: string;
  lastName: string;
  // 🚀 Updated to perfectly match your Prisma schema relationships
  classTeacherOf?: {
    id: string;
    name: string; // The Section Name (e.g., "Alpha")
    academicClass: {
      name: string; // The Class Name (e.g., "Grade 10")
    };
  } | null;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  studentData: StudentProfile | null;
  teacherData: TeacherProfile | null;
  className: string | null;
  sectionName: string | null;
  sectionId: string | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // 1. Reading both from local storage
  const [token] = useState<string | null>(localStorage.getItem("token"));
  const [role] = useState<string | null>(localStorage.getItem("role"));
  
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [teacherData, setTeacherData] = useState<TeacherProfile | null>(null);
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
          console.log("📡 useAuth: Fetching student profile...");
          const res = await axios.get("http://localhost:5000/api/students/me", { headers });
          if (res.data.success) {
            console.log("✅ useAuth: Student profile resolved!", res.data.data);
            setStudentData(res.data.data);
          }
        } 
        else if (role === "TEACHER") {
          console.log("📡 useAuth: Fetching teacher profile...");
          const res = await axios.get("http://localhost:5000/api/teachers/me", { headers });
          if (res.data.success) {
            console.log("✅ useAuth: Teacher profile resolved!", res.data.data);
            setTeacherData(res.data.data);
          }
        }

      } catch (err: any) {
        console.error("❌ useAuth: Session restoration failed:", err.response?.data?.message || err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    hydrateSession();
  }, [token, role]);

  const globalClassName = teacherData?.classTeacherOf?.academicClass?.name || null;
  const globalSectionName = teacherData?.classTeacherOf?.name || null;
  const globalSectionId = teacherData?.classTeacherOf?.id || null;

  return (
    <AuthContext.Provider 
      value={{ 
        token, 
        role, 
        studentData, 
        teacherData, 
        className: globalClassName,
        sectionName: globalSectionName,
        sectionId: globalSectionId,
        loading, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};