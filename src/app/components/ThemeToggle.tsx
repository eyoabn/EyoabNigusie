import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="group fixed right-8 top-8 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-lg transition-all hover:scale-110 hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-neon-blue transition-transform group-hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 text-neon-purple transition-transform group-hover:-rotate-12" />
      )}
    </button>
  );
}
