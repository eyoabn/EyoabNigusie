import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Terminal } from "lucide-react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const BOOT_SEQUENCE = [
  "Initializing core system...",
  "Loading neural network modules...",
  "Mounting encrypted file system...",
  "Establishing secure connection...",
  "Compiling UI components...",
  "Running pre-flight checks...",
  "System optimal. Launching...",
];

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    const duration = 2800; // slightly longer for reading effect
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 400);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  // The page renders behind this overlay, so scrolling has to be held back
  // until the boot sequence finishes or is skipped.
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Escape is the conventional "get me out of here" key for a blocking overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onLoadingComplete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLoadingComplete]);

  useEffect(() => {
    // Update terminal lines based on progress
    const lineIndex = Math.min(
      Math.floor((progress / 100) * BOOT_SEQUENCE.length),
      BOOT_SEQUENCE.length - 1
    );
    setCurrentLine(lineIndex);
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] px-4 font-mono"
      role="status"
      aria-label="Loading portfolio"
    >
      {/* Nobody should be held hostage by an intro animation. */}
      <button
        onClick={onLoadingComplete}
        className="absolute right-5 top-5 z-20 rounded-full border border-neon-blue/30 px-4 py-1.5 text-xs tracking-wider text-neon-blue/70 transition-colors hover:border-neon-blue hover:text-neon-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan"
      >
        SKIP
      </button>

      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/10 via-background to-background" />

      {/* Terminal Window */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-lg border border-neon-blue/30 bg-black/80 shadow-[0_0_50px_rgba(0,212,255,0.15)] backdrop-blur-xl">
        {/* Terminal Header */}
        <div className="flex items-center gap-2 border-b border-neon-blue/30 bg-neon-blue/10 px-4 py-2">
          <Terminal className="h-4 w-4 text-neon-blue" />
          <span className="text-xs font-semibold text-neon-blue/80 tracking-widest">root@eyoab-portfolio:~</span>
          <div className="ml-auto flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 text-sm md:text-base">
          {BOOT_SEQUENCE.map((line, index) => (
            <motion.div
              key={line}
              initial={{ opacity: 0, x: -10 }}
              animate={{ 
                opacity: index <= currentLine ? 1 : 0,
                x: index <= currentLine ? 0 : -10 
              }}
              transition={{ duration: 0.2 }}
              className="mb-2 flex items-center gap-3 text-neon-cyan/80"
            >
              <span className="text-neon-purple font-bold">{'>'}</span>
              <span>{line}</span>
              {index === currentLine && progress < 100 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block h-4 w-2 bg-neon-cyan"
                />
              )}
              {index < currentLine && (
                <span className="ml-auto text-green-400 font-semibold">[OK]</span>
              )}
            </motion.div>
          ))}

          {/* Progress Section */}
          <div className="mt-8">
            <div className="mb-2 flex justify-between text-xs text-neon-blue tracking-wider font-bold">
              <span>SYSTEM_BOOT</span>
              <span>{Math.floor(progress)}%</span>
            </div>
            
            {/* Block Progress Bar */}
            <div className="flex h-6 w-full overflow-hidden rounded border border-neon-blue/30 bg-black/50 p-1">
              <motion.div
                className="h-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-blue"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                style={{
                  boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cyberpunk grid overlay */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(0, 212, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 212, 255, 0.5) 1px, transparent 1px)",
          backgroundSize: "30px 30px"
        }}
      />
    </motion.div>
  );
}
