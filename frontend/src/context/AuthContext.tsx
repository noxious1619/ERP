import React, { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface StudentProfile {
  id: string;
  admissionNumber: string;
  rollNumber: string | null;
  sectionId: string;
}

interface AuthContextType {
  token: string | null;
  role: string | null;
  studentData: StudentProfile | null;
  loading: boolean;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token] = useState<string | null>(localStorage.getItem("token"));
  const [role] = useState<string | null>(localStorage.getItem("role"));
  const [studentData, setStudentData] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const hydrateStudentSession = async () => {
      // Step 1: Verify token exists in storage rows
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📡 useAuth: Fetching student profile from database...");
        
        // Pass your active bearer token string into request headers
        const headers = { Authorization: `Bearer ${token}` };

        // Step 2: Fire request to your specific endpoint gateway layout
        const res = await axios.get("http://localhost:5000/api/students/me", { headers });
        
        if (res.data.success) {
          console.log("✅ useAuth: Student profile successfully resolved!", res.data.data);
          setStudentData(res.data.data); // Hydrate local memory state cache
        }
      } catch (err: any) {
        console.error("❌ useAuth: Session restoration failed:", err.response?.data?.message || err.message);
        // Optional: logout(); if you want to wipe expired tokens right away
      } finally {
        setLoading(false);
      }
    };

    hydrateStudentSession();
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, role, studentData, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};