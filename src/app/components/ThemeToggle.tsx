import { Moon, Sun, MonitorCog } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTheme } from "../lib/theme";

const LABELS = {
  light: "Light theme",
  dark: "Dark theme",
  system: "System theme",
} as const;

export function ThemeToggle() {
  const { theme, cycleTheme } = useTheme();

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : MonitorCog;

  return (
    <button
      onClick={cycleTheme}
      className="group fixed right-4 top-3.5 z-[60] flex h-9 w-9 items-center justify-center rounded-xl border border-border/80 bg-card/90 shadow-2xs backdrop-blur-md transition-all hover:border-foreground/30 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background md:right-6 md:top-3 md:h-10 md:w-10 cursor-pointer"
      aria-label={`${LABELS[theme]}. Click to switch.`}
      title={LABELS[theme]}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <Icon className="h-4 w-4 text-foreground" />
        </motion.span>
      </AnimatePresence>

      <span className="pointer-events-none absolute right-full mr-2.5 whitespace-nowrap rounded-lg border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground opacity-0 shadow-xs backdrop-blur-md transition-opacity group-hover:opacity-100">
        {LABELS[theme]}
      </span>
    </button>
  );
}
