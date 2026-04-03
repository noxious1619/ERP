import { useState } from "react";
import { Button, Card, Input, Link } from "@heroui/react";
import { ArrowRight, ShieldCheck, ArrowRightIcon } from "lucide-react";

export default function OTPVerification() {
  const [otp, setOtp] = useState("");

  return (
    <div className="h-screen w-screen flex bg-[#5D45FD] overflow-hidden font-sans">

      {/* LEFT SIDE (Same Branding) */}
      <div className="hidden lg:flex flex-[1.2] flex-col justify-center p-20 text-white relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/20">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-7xl font-black italic leading-[0.9]">
            EdaOS <br />
            <span className="opacity-40 text-5xl font-medium not-italic">
              Verification
            </span>
          </h1>

          <p className="text-xl opacity-70 max-w-md mt-4">
            Secure identity verification required before accessing your portal.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex-1 bg-white lg:rounded-l-[4rem] flex items-center justify-center p-8">
        <div className="w-full max-w-md flex flex-col gap-8">

          {/* HEADER */}
          <header className="space-y-2">
            <h2 className="text-4xl font-black text-slate-800">
              Enter OTP
            </h2>
            <p className="text-slate-400 text-xs uppercase tracking-widest">
              Verification Chamber
            </p>
          </header>

          {/* CARD */}
          <Card className="border-2 p-6 rounded-3xl shadow-lg">
            <Card.Content className="flex flex-col gap-6">

              {/* INSTRUCTION */}
              <p className="text-sm text-slate-500">
                We’ve sent a secure 6-digit code to your registered mobile number.
              </p>

              {/* OTP INPUT */}
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                variant="secondary"
                className="text-center text-lg tracking-widest font-bold"
              />

              {/* RESEND */}
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400">
                  Didn’t receive code?
                </span>
                <Link href="#" className="text-[#5D45FD] text-xs font-bold">
                  Resend OTP
                </Link>
              </div>

              {/* VERIFY BUTTON */}
              <Button
                radius="full"
                className="w-full h-12 bg-[#5D45FD] text-white font-bold hover:scale-[1.02] transition-transform active:scale-95"
                endContent={<ArrowRight size={18} />}
              >
                VERIFY & CONTINUE
                <ArrowRightIcon size={18} className="ml-2" />
              </Button>

            </Card.Content>
          </Card>

        </div>
      </div>
    </div>
  );
}