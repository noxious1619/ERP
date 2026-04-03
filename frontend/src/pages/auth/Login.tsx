import { useState } from "react";
import { Button, Card, Input, Checkbox, Link, Label } from "@heroui/react";
import {
  Lock,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  Settings2,
  ArrowRightIcon
} from "lucide-react";
import GlobalLoader from "../../components/GlobalLoader";

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [mode, setMode] = useState("password"); // password | otp
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true); // Trigger the 5-second loader
  };

  const onLoadingComplete = () => {
    setIsLoading(false);
    // Logic for Role-Based Redirect goes here
    console.log("Redirecting to Dashboard...");
  };
  

  const roles = [
    { id: "student", label: "Student", icon: GraduationCap },
    { id: "teacher", label: "Teacher", icon: Briefcase },
    { id: "admin", label: "Admin", icon: Settings2 },
  ];

  return (
    <>
    <GlobalLoader isVisible={isLoading} onFinished={onLoadingComplete} />
    <div className="h-screen w-screen flex bg-[#5D45FD] overflow-hidden font-sans antialiased">

      {/* LEFT SIDE: BRAND IDENTITY */}
      <div className="hidden lg:flex flex-[1.4] flex-col justify-center p-24 text-white relative">
        {/* Animated Background Accents */}
        <div className="absolute -top-24 -left-24 w-[30rem] h-[30rem] bg-white/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-[100px]" />

        <div className="relative z-10 flex flex-col gap-8">
          <div className="bg-white/15 w-20 h-20 rounded-[2.5rem] flex items-center justify-center border border-white/20 backdrop-blur-2xl shadow-2xl">
            <ShieldCheck size={40} strokeWidth={1.5} />
          </div>

          <div className="space-y-2">
            <h1 className="text-8xl font-black italic tracking-tighter leading-[0.85] drop-shadow-2xl">
              EdaOS <br />
            </h1>
          </div>

          <p className="text-2xl font-medium opacity-60 max-w-md leading-relaxed">
            The multi-role operating system for modern institutions. Secure, fast, and fully integrated.
          </p>

        </div>

        <p className="absolute bottom-12 left-24 text-[10px] font-bold opacity-30 tracking-[0.5em] uppercase">
          Powered by Red Hawk Consultancy
        </p>
      </div>

      {/* RIGHT SIDE: AUTH FORM */}
      <div className="flex-1 bg-white lg:rounded-l-[5rem] shadow-[-80px_0_100px_rgba(0,0,0,0.1)] flex items-center justify-center p-10 relative">
        <div className="w-full max-w-[420px] flex flex-col gap-10">

          {/* HEADER */}
          <header className="space-y-3">
            <h2 className="text-5xl font-black text-slate-900 tracking-tight">Sign In</h2>
          </header>

          {/* FORM CARD */}
          <Card className="border-2 shadow-[0_40px_100px_rgba(93,69,253,0.08)] rounded-[3rem] bg-slate-50/50">
            <Card.Content className="flex flex-col gap-8 p-8">

              {/* MODE TOGGLE */}
              <div className="flex bg-slate-200/50 rounded-2xl p-1.5 gap-1">
                <button
                  onClick={() => setMode("password")}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    mode === "password"
                      ? "bg-white text-[#5D45FD] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Password
                </button>

                <button
                  onClick={() => setMode("otp")}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                    mode === "otp"
                      ? "bg-white text-[#5D45FD] shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  OTP Login
                </button>
              </div>

              {/* FORM CONTENT */}
              <div className="space-y-5">
                {mode === "password" ? (
                  <>
                    <Input
                      className="w-full"
                      label="School ID / Email"
                      placeholder="ED-2026-001"
                      labelPlacement="outside"
                      radius="xl"
                      classNames={{ inputWrapper: "h-14 border-slate-200 focus-within:!border-[#5D45FD] transition-colors" }}
                      startContent={<User size={18} className="text-slate-400" />}
                    />
                    <Input
                      className="w-full border-2"
                      label="Security_Password"
                      placeholder="••••••••"
                      type="password"
                      labelPlacement="outside"
                      radius="xl"
                      classNames={{ inputWrapper: "h-14 border-slate-200 focus-within:!border-[#5D45FD] transition-colors" }}
                      startContent={<Lock size={18} className="text-slate-400" />}
                    />
                  </>
                ) : (
                  <Input
                    className="w-full"
                    label="Registered Mobile"
                    placeholder="+91"
                    labelPlacement="outside"
                    variant="secondary"
                    radius="Xl"
                    classNames={{ inputWrapper: "h-14 border-slate-200 focus-within:!border-[#5D45FD] transition-colors" }}
                    startContent={<Phone size={18} className="text-slate-400" />}
                  />
                )}
              </div>

              {/* OPTIONS */}
              <div className="flex justify-between items-center px-1">
                <Checkbox id="basic-terms">
                <Checkbox.Control>
                  <Checkbox.Indicator />
                </Checkbox.Control>
                <Checkbox.Content>
                  <Label htmlFor="basic-terms">Remember me</Label>
                </Checkbox.Content>
              </Checkbox>

                <Link href="#" className="text-[#5D45FD] text-[11px] font-black hover:underline">
                  Forgot Password ?
                </Link>
              </div>

              {/* BUTTON */}
              <Button
                onClick={handleLogin}
                radius="xl"
                className="h-16 w-full bg-[#5D45FD] text-white font-black text-lg shadow-[0_20px_40px_rgba(93,69,253,0.3)] hover:scale-[1.02] transition-transform active:scale-95"
                endContent={<ArrowRight size={22} strokeWidth={1} />}
              >
                Sign In
                <ArrowRightIcon size={22} strokeWidth={3} className="ml-2" scale={34}/>
              </Button>

            </Card.Content>
          </Card>

          {/* FOOTER */}
          <footer className="text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] leading-relaxed">
              New identity required? <br/>
              <span className="text-slate-900">Contact School Administrator</span>
            </p>
          </footer>

        </div>
      </div>
    </div>
    </>
  );
}