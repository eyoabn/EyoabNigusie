import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      const target = e.target as HTMLElement;
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
          target.tagName === "A" ||
          target.tagName === "BUTTON"
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Core pointer */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden h-3 w-3 rounded-full bg-white mix-blend-difference md:block"
        animate={{
          x: mousePosition.x - 6,
          y: mousePosition.y - 6,
          scale: isPointer ? 0.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 35,
          mass: 0.2,
        }}
      />

      {/* Primary shadow aura */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-24 w-24 rounded-full bg-neon-cyan/30 blur-[20px] md:block"
        animate={{
          x: mousePosition.x - 48,
          y: mousePosition.y - 48,
          scale: isPointer ? 1.5 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 250,
          damping: 20,
          mass: 0.5,
        }}
      />

      {/* Secondary colored trail shadow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-32 w-32 rounded-full bg-neon-purple/20 blur-[30px] md:block"
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
          scale: isPointer ? 1.2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 150,
          damping: 25,
          mass: 1.2,
        }}
      />

      {/* Tertiary deep shadow */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9997] hidden h-40 w-40 rounded-full bg-neon-pink/10 blur-[40px] md:block"
        animate={{
          x: mousePosition.x - 80,
          y: mousePosition.y - 80,
          scale: isPointer ? 1 : 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 30,
          mass: 2,
        }}
      />
    </>
  );
}
