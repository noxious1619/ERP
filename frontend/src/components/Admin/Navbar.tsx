"use client";

import { User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function AdminNavbar() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div />

      <div className="flex items-center gap-3">
        {/* Profile */}
        <button
          onClick={() => navigate("/admin/profile")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
          title="Profile"
        >
          <User className="h-4 w-4" />
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
