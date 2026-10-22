import { motion } from "motion/react";
import { ArrowRight, Github, Mail, Download, MapPin, Code2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";

const roles = [
  "Full-Stack Developer",
  "Flutter & Mobile Engineer",
  "Software Engineer",
  "Backend & API Builder",
];

function useTypewriter(words: string[], speed = 80, pause = 1800) {
  const [displayed, setDisplayed] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), speed);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), speed / 2);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setWordIndex((i) => (i + 1) % words.length);
    }

    setDisplayed(current.slice(0, charIndex));
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return displayed;
}

export function Hero() {
  const role = useTypewriter(roles);

  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden px-6 pt-24 pb-16 lg:px-12">
      <div className="container mx-auto grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
        
        {/* Left Column: Authentic Human Intro (7 cols on large screens) */}
        <motion.div
          className="flex flex-col items-start text-left lg:col-span-7"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Status & Focus Badge */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/80 px-3.5 py-1.5 text-xs text-foreground/80 backdrop-blur-sm shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span className="font-medium">Available for work</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>Adama, Ethiopia • Open to remote</span>
            </div>
          </div>

          {/* Clean, Human Headline */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Hi, I'm <span className="text-foreground">Eyoab Nigusie</span>.
          </h1>

          {/* Role Typewriter */}
          <div className="mb-6 flex items-center gap-2 text-xl font-medium text-foreground/90 sm:text-2xl">
            <span className="text-muted-foreground">I build as a</span>
            <span className="text-primary font-semibold">
              {role}
              <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-primary align-middle" />
            </span>
          </div>

          {/* Human Bio Statement */}
          <p className="mb-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Software engineering student at ASTU crafting responsive full-stack web applications and robust cross-platform mobile apps with Flutter. Focused on clean architecture, intuitive UX, and turning complex ideas into solid products.
          </p>

          {/* Action Buttons */}
          <div className="mb-10 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md active:scale-95"
            >
              <span>View Selected Work</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-xs transition-all hover:bg-muted active:scale-95"
            >
              <Download className="h-4 w-4 text-muted-foreground" />
              <span>Download CV</span>
            </a>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pl-2">
              <a
                href="https://github.com/eyoabn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="mailto:eyoabnigusie@gmail.com"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card/60 text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Technical Highlights */}
          <div className="grid w-full max-w-xl grid-cols-3 gap-3 border-t border-border/60 pt-6">
            <div>
              <div className="text-xl font-bold tracking-tight text-foreground">15+</div>
              <div className="text-xs text-muted-foreground">Projects Built</div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-foreground">ASTU '28</div>
              <div className="text-xs text-muted-foreground">Software Engineering</div>
            </div>
            <div>
              <div className="text-xl font-bold tracking-tight text-foreground">Full-Stack</div>
              <div className="text-xs text-muted-foreground">& Flutter Mobile</div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Grounded Human Portrait & Craft Cards (5 cols) */}
        <motion.div
          className="relative flex items-center justify-center lg:col-span-5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-full max-w-sm sm:max-w-md">
            
            {/* Portrait Frame */}
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] overflow-hidden rounded-3xl border border-border/80 bg-card p-2 shadow-xl">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-muted">
                <picture>
                  <source srcSet="/profile.avif" type="image/avif" />
                  <source srcSet="/profile.webp" type="image/webp" />
                  <img
                    src="/profile.jpg"
                    alt="Eyoab Nigusie"
                    width={340}
                    height={425}
                    loading="eager"
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                  />
                </picture>
              </div>
            </div>

            {/* Companion Card 1: Flutter & Mobile Focus (Bottom Left) */}
            <motion.div
              className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border/90 bg-card/95 p-3.5 shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Flutter & Mobile</p>
                <p className="text-[11px] text-muted-foreground">Dart • Clean Arch • Firebase</p>
              </div>
            </motion.div>

            {/* Companion Card 2: Modern Web Stack (Top Right) */}
            <motion.div
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 hidden sm:flex items-center gap-3 rounded-2xl border border-border/90 bg-card/95 p-3.5 shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Code2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Full-Stack Web</p>
                <p className="text-[11px] text-muted-foreground">React • TypeScript • Node</p>
              </div>
            </motion.div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}