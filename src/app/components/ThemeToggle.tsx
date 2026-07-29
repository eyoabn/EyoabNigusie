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
      className="group fixed right-6 top-6 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/60 backdrop-blur-lg transition-all hover:scale-110 hover:border-neon-cyan hover:shadow-[0_0_20px_rgba(6,182,212,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background md:right-8 md:top-8"
      aria-label={`${LABELS[theme]}. Click to switch.`}
      title={LABELS[theme]}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="flex items-center justify-center"
        >
          <Icon className="h-5 w-5 text-neon-cyan" />
        </motion.span>
      </AnimatePresence>

      {/* Label appears on hover so the current mode is discoverable without clicking through all three. */}
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-border bg-card/90 px-3 py-1.5 text-xs text-muted-foreground opacity-0 backdrop-blur-lg transition-opacity group-hover:opacity-100">
        {LABELS[theme]}
      </span>
    </button>
  );
}
