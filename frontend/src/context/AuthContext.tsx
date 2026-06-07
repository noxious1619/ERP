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
  classTeacherOf: {
    id: string;       // Section ID
    classId: string;  // Class ID
  } | null;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  studentData: StudentProfile | null;
  teacherData: TeacherProfile | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
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

        // 🚀 The Fork in the Road: Check role before routing the fetch!
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
      } finally {
        setLoading(false);
      }
    };

    hydrateSession();
  }, [token, role]);

  return (
    <AuthContext.Provider value={{ token, role, studentData, teacherData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};