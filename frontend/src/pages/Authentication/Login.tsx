import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const LOGO_SRC = "/assets/school-logo.png";
const SCHOOL_NAME = "SCHOOL NAME";
const API_BASE_URL = "http://localhost:5000";

// Maps a backend role string to the dashboard route it should land on.
const ROLE_REDIRECTS: Record<string, string> = {
  STUDENT: "/student/dashboard",
  TEACHER: "/teacher/dashboard",
  ADMIN: "/admin/dashboard",
  SUPER_ADMIN: "/admin/dashboard",
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, role } = res.data;
      const redirectPath = ROLE_REDIRECTS[role];

      if (!redirectPath) {
        setError("Your account role isn't recognized. Contact an admin.");
        setIsSubmitting(false);
        return;
      }

      // Persist session. AuthProvider reads these from localStorage on
      // mount, so a hard navigation (same pattern as logout()) forces
      // it to re-initialize with the fresh values.
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      window.location.href = redirectPath;
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again in a bit.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
      <div className="w-full max-w-5xl bg-white rounded-[28px] shadow-xl shadow-blue-100/60 overflow-hidden flex flex-col md:flex-row">
        {/* -------------------- LEFT PANEL -------------------- */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-[#e3edfc] to-[#dbe7fa] items-center justify-center p-10">
          {/* Placeholder illustration — swap ILLUSTRATION_SRC above with your own image */}
          <img
            src="../public/login.png"
            alt="Student login illustration"
            className="w-full max-w-sm object-contain select-none"
            draggable={false}
            onError={(e) => {
              // Friendly inline fallback so the layout still looks right
              // before you've added your own illustration file.
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        {/* -------------------- RIGHT PANEL -------------------- */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center px-8 py-12 sm:px-14 sm:py-14">
          {/* Logo */}
          <img
            src={LOGO_SRC}
            alt={`${SCHOOL_NAME} logo`}
            className="h-24 w-24 object-contain mb-4 select-none"
            draggable={false}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />

          {/* Heading */}
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-800 text-center">
            {SCHOOL_NAME}
          </h1>
          <p className="mt-1 text-lg font-semibold text-blue-600 text-center">
            Login PANEL
          </p>

          {/* Error message */}
          {error && (
            <p
              role="alert"
              className="w-full mt-6 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-2 text-center"
            >
              {error}
            </p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="w-full mt-8 space-y-8">
            {/* Email */}
            <div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="username"
                className="w-full bg-transparent text-slate-700 placeholder-slate-400 text-lg
                           border-0 border-b-2 border-slate-200 focus:border-blue-500
                           outline-none pb-3 transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-slate-700 placeholder-slate-400 text-lg
                             border-0 border-b-2 border-slate-200 focus:border-blue-500
                             outline-none pb-3 pr-10 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-0 bottom-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-5 w-5 rounded-[4px] border-2 border-slate-800 text-blue-600
                             focus:ring-blue-500 accent-blue-600 cursor-pointer"
                />
                <span className="text-base">Remember me</span>
              </label>
            </div>

            {/* Sign in button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700
                         disabled:bg-blue-300 disabled:cursor-not-allowed
                         text-white font-bold text-lg rounded-2xl py-4
                         shadow-md shadow-blue-200 transition-colors"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
