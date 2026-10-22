import { motion } from "motion/react";
import { Link } from "react-router";
import { ArrowLeft, Compass } from "lucide-react";
import { useEffect } from "react";
import { UniverseBackground } from "../components/UniverseBackground";

export function NotFound() {
  useEffect(() => {
    document.title = "404 — Page not found | Eyoab Nigusie";
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 text-foreground">
      <UniverseBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 max-w-md text-center"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-card shadow-xs">
          <Compass className="h-8 w-8 text-primary" />
        </div>

        <h1 className="mb-2 text-6xl font-extrabold tracking-tight text-foreground">
          404
        </h1>
        <h2 className="mb-2 text-xl font-bold text-foreground">Page not found</h2>
        <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to portfolio</span>
        </Link>
      </motion.div>
    </div>
  );
}
