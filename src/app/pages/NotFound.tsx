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

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/10 blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-lg text-center"
      >
        <motion.div
          animate={{ rotate: [0, 12, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border bg-card/50 backdrop-blur-lg"
        >
          <Compass className="h-9 w-9 text-neon-cyan" />
        </motion.div>

        <h1 className="mb-4 bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple bg-clip-text text-7xl font-bold tracking-tight text-transparent">
          404
        </h1>
        <h2 className="mb-3 text-2xl font-medium">Lost in space</h2>
        <p className="mb-10 text-muted-foreground">
          This page drifted out of orbit. Let's get you back to somewhere familiar.
        </p>

        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan px-7 py-3 text-sm font-medium text-background transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to portfolio
        </Link>
      </motion.div>
    </div>
  );
}
