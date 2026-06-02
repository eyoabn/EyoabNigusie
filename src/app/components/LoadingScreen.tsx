import { motion } from "motion/react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const duration = 2500;
    const interval = 20;
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onLoadingComplete, 300);
          return 100;
        }
        return next;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-neon-blue/10 blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-neon-purple/10 blur-[120px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />
      </div>

      {/* Loading Content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Spinner with Rings */}
        <div className="relative h-32 w-32">
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-neon-blue/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue shadow-[0_0_15px_rgba(0,212,255,0.8)]" />
          </motion.div>

          {/* Middle Ring */}
          <motion.div
            className="absolute inset-4 rounded-full border-2 border-neon-purple/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </motion.div>

          {/* Inner Ring */}
          <motion.div
            className="absolute inset-8 rounded-full border-2 border-neon-cyan/20"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.8)]" />
          </motion.div>

          {/* Center Glow */}
          <motion.div
            className="absolute inset-0 m-auto h-8 w-8 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{ filter: "blur(8px)" }}
          />
        </div>

        {/* Progress Counter */}
        <div className="text-center">
          <motion.div
            className="mb-2 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan bg-clip-text text-6xl tabular-nums text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {Math.floor(progress)}%
          </motion.div>
          <motion.div
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Loading Experience
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-64 overflow-hidden rounded-full border border-border bg-muted/20">
          <motion.div
            className="h-1 rounded-full bg-gradient-to-r from-neon-blue via-neon-purple to-neon-cyan"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            style={{
              boxShadow: "0 0 20px rgba(0, 212, 255, 0.5)",
            }}
          />
        </div>

        {/* Loading Dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2 w-2 rounded-full bg-neon-cyan"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner Accents */}
      <div className="pointer-events-none absolute left-8 top-8 h-16 w-16 border-l-2 border-t-2 border-neon-blue/50" />
      <div className="pointer-events-none absolute right-8 top-8 h-16 w-16 border-r-2 border-t-2 border-neon-purple/50" />
      <div className="pointer-events-none absolute bottom-8 left-8 h-16 w-16 border-b-2 border-l-2 border-neon-cyan/50" />
      <div className="pointer-events-none absolute bottom-8 right-8 h-16 w-16 border-b-2 border-r-2 border-neon-pink/50" />
    </motion.div>
  );
}
