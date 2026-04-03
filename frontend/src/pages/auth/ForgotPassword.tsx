import { useState } from "react";
import { Button, Card, Input, Link } from "@heroui/react";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  return (
    <div className="h-screen w-screen flex bg-[#5D45FD] overflow-hidden font-sans">

      {/* LEFT SIDE (CONSISTENT BRANDING) */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-center p-20 text-white relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-7xl font-black italic leading-[0.9]">
            EdaOS <br />
            <span className="opacity-40 text-5xl font-medium not-italic">
              Recovery Path
            </span>
          </h1>

          <p className="text-xl opacity-70 max-w-md mt-4">
            Regain access to your account securely through identity verification.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-white lg:rounded-l-[4rem] flex items-center justify-center p-8">
        <div className="w-full max-w-md flex flex-col gap-8">

          {/* HEADER */}
          <header className="space-y-2">
            <h2 className="text-4xl font-black text-slate-800">
              Forgot Password
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest">
              Recovery Path
            </p>
          </header>

          {/* CARD */}
          <Card className="p-6 rounded-3xl shadow-lg">
            <Card.Content className="flex flex-col gap-6">

              {/* INSTRUCTION */}
              <p className="text-sm text-slate-500">
                Enter your registered email or ID. We’ll send you a secure link or OTP to reset your password.
              </p>

              {/* INPUT */}
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email / School ID"
                placeholder="e.g. ED-2026-001"
                variant="bordered"
                startContent={<Mail size={16} />}
              />

              {/* ACTION BUTTON */}
              <Button
                radius="full"
                className="h-12 bg-[#5D45FD] text-white font-bold"
                endContent={<ArrowRight size={18} />}
              >
                SEND RECOVERY LINK
              </Button>

              {/* BACK TO LOGIN */}
              <div className="text-center">
                <Link href="/" className="text-[#5D45FD] text-xs font-bold">
                  Back to Login
                </Link>
              </div>

            </Card.Content>
          </Card>

          {/* FOOTER */}
          <p className="text-center text-xs text-slate-400">
            Make sure you have access to your registered email or phone
          </p>

        </div>
      </div>
    </div>
  );
}