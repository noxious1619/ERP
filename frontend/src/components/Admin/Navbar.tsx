"use client";

import { Search, Plus, Bell, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminNavbar() {
  const navigate = useNavigate();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="relative"></div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/admin/profile")}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
        >
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
