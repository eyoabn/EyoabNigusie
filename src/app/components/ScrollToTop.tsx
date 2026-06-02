import { motion, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsVisible(latest > 500);
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/80 backdrop-blur-lg transition-all hover:border-neon-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5 text-neon-cyan" />
    </motion.button>
  );
}
