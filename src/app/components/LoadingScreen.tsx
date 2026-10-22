import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fast, crisp loading pulse (under 600ms) rather than tedious 3-second fake terminal
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 180);
          return 100;
        }
        return prev + 25;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onLoadingComplete();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-4"
      role="status"
      aria-label="Loading portfolio"
    >
      <div className="flex flex-col items-center gap-4">
        {/* Monogram */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card shadow-sm"
        >
          <span className="text-xl font-bold tracking-tight text-foreground">EN</span>
        </motion.div>

        {/* Title */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">Eyoab Nigusie</p>
          <p className="text-xs text-muted-foreground">Portfolio</p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="mt-2 h-1 w-32 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            style={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.1 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
