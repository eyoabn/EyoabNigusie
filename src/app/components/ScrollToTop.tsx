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
      className="fixed bottom-8 right-8 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-card text-foreground shadow-sm transition-all hover:border-foreground/30 hover:shadow-md cursor-pointer"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-4 w-4" />
    </motion.button>
  );
}
