import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function GlobalLoader({ 
  isVisible, 
  onFinished 
}: { 
  isVisible: boolean; 
  onFinished?: () => void 
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isVisible) {
      setProgress(0);
      const duration = 5000; // 5 Seconds
      const intervalTime = 50; 
      const increment = (intervalTime / duration) * 100;

      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            if (onFinished) onFinished();
            return 100;
          }
          return prev + increment;
        });
      }, intervalTime);

      return () => clearInterval(timer);
    }
  }, [isVisible, onFinished]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#5D45FD]">
      {/* Decorative Background Blurs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] animate-pulse" />
      
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Animated Icon Container */}
        <div className="bg-white/15 w-24 h-24 rounded-[2.5rem] flex items-center justify-center border border-white/20 backdrop-blur-2xl shadow-2xl animate-bounce">
          <ShieldCheck size={48} className="text-white" strokeWidth={1.5} />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-4xl font-black italic text-white tracking-tighter italic">
            EdaOS <span className="opacity-50 not-italic font-medium">Syncing</span>
          </h2>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">
            Establishing Secure Identity...
          </p>
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden border border-white/5 mt-4">
          <div 
            className="h-full bg-white transition-all duration-75 ease-linear shadow-[0_0_15px_rgba(255,255,255,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Percentage Text */}
        <span className="text-white/40 font-mono text-xs tabular-nums">
          {Math.round(progress)}%
        </span>
      </div>

      <p className="absolute bottom-12 text-[10px] font-bold text-white/30 tracking-[0.5em] uppercase">
        Initializing Workspace Protocols
      </p>
    </div>
  );
}