import { motion, useMotionValue, useTransform, useSpring } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail, Download } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const roles = [
  "Software Engineer",
  "AI/ML Engineer",
  "Flutter Developer",
  "Full-Stack Developer",
  "Open Source Contributor",
];

const floatingTech = [
  { label: "Python", color: "#06b6d4", angle: 0 },
  { label: "React", color: "#00d4ff", angle: 45 },
  { label: "Flutter", color: "#a855f7", angle: 90 },
  { label: "TensorFlow", color: "#ec4899", angle: 135 },
  { label: "TypeScript", color: "#00d4ff", angle: 180 },
  { label: "Docker", color: "#06b6d4", angle: 225 },
  { label: "AWS", color: "#a855f7", angle: 270 },
  { label: "Next.js", color: "#ec4899", angle: 315 },
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const role = useTypewriter(roles);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  // Parallax transforms for background blobs
  const blob1X = useTransform(smoothX, [-500, 500], [-30, 30]);
  const blob1Y = useTransform(smoothY, [-500, 500], [-30, 30]);
  const blob2X = useTransform(smoothX, [-500, 500], [30, -30]);
  const blob2Y = useTransform(smoothY, [-500, 500], [30, -30]);
  const blob3X = useTransform(smoothX, [-500, 500], [-15, 15]);
  const blob3Y = useTransform(smoothY, [-500, 500], [20, -20]);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-neon-blue/10 blur-[120px]"
          style={{ x: blob1X, y: blob1Y }}
        />
        <motion.div
          className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-neon-purple/10 blur-[120px]"
          style={{ x: blob2X, y: blob2Y }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-neon-cyan/10 blur-[120px]"
          style={{ x: blob3X, y: blob3Y }}
        />
      </div>

      {/* Content Container (Creative Split Layout) */}
      <div className="relative z-10 container mx-auto grid min-h-screen grid-cols-1 items-center gap-12 px-6 pt-20 md:grid-cols-2 lg:px-12">
        {/* Left Column: Text Content */}
        <motion.div
          className="flex flex-col items-start text-left"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Badges Row */}
          <div className="mb-8 flex flex-wrap items-center gap-4">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium text-green-400">Open to opportunities</span>
            </motion.div>

            <motion.div
              className="inline-block rounded-full border border-neon-blue/30 bg-neon-blue/5 px-4 py-2 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-xs font-bold uppercase tracking-widest text-transparent">
                Software Engineer
              </span>
            </motion.div>
          </div>

          {/* Name with Creative Layout */}
          <h1 className="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
            <span className="text-foreground">Eyoab</span>
            <br />
            <span className="bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan bg-clip-text text-transparent">
              Nigusie
            </span>
          </h1>

          {/* Typewriter Role */}
          <motion.div
            className="mb-8 flex items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span className="text-lg text-muted-foreground md:text-2xl">I'm a</span>
            <span className="text-lg font-medium text-neon-cyan md:text-2xl">
              {role}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="ml-0.5 inline-block h-6 w-0.5 bg-neon-cyan align-middle"
              />
            </span>
          </motion.div>

          <motion.p
            className="mb-10 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Crafting innovative solutions with AI, Machine Learning & Modern Web Technologies. Turning complex problems into elegant digital experiences.
          </motion.p>

          {/* CTA Buttons - More distinctive styling */}
          <motion.div
            className="mb-12 flex flex-wrap items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="#projects"
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-neon-blue to-neon-cyan px-8 py-4 font-medium text-background transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Explore My Work</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="/resume.pdf"
              download
              className="group flex items-center gap-3 rounded-2xl border border-border bg-card/30 px-8 py-4 font-medium backdrop-blur-md transition-all hover:border-neon-purple hover:bg-neon-purple/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="h-4 w-4 text-neon-purple transition-transform group-hover:-translate-y-1" />
              <span className="text-foreground">Download CV</span>
            </motion.a>
          </motion.div>

          {/* Social Links aligned left */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="h-[2px] w-12 bg-gradient-to-r from-neon-purple to-neon-blue" />
            {[
              { icon: Github, label: "GitHub", href: "https://github.com/eyoabn" },
              { icon: Linkedin, label: "LinkedIn", href: "#" },
              { icon: Mail, label: "Email", href: "mailto:eyoabnigusie@gmail.com" },
            ].map(({ icon: Icon, label, href }) => (
              <motion.a
                key={label}
                href={href}
                className="group relative flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card/30 backdrop-blur-lg transition-all hover:border-neon-blue hover:bg-neon-blue/10"
                whileHover={{ scale: 1.1, y: -5 }}
                aria-label={label}
              >
                <Icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-neon-blue" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Column: Visual Elements */}
        <motion.div
          className="relative hidden h-full w-full items-center justify-center md:flex"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Abstract Geometric Core */}
          <div className="relative flex items-center justify-center">
            <motion.div
              className="absolute h-64 w-64 lg:h-[28rem] lg:w-[28rem]"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 rounded-[2rem] border-2 border-neon-blue/20"
                style={{ boxShadow: "0 0 60px rgba(0, 212, 255, 0.1)" }}
              />
              <div className="absolute inset-8 rounded-full border-2 border-neon-purple/20 border-dashed"
                style={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.1)" }}
              />
              <div className="absolute inset-16 rounded-[1.5rem] border-2 border-neon-cyan/20"
                style={{ rotate: "45deg" }}
              />
            </motion.div>

            {/* Center Core — Profile Photo */}
            <div className="relative z-10 flex items-center justify-center">

              {/* Spinning conic-gradient outer circle (the ring itself) */}
              <motion.div
                className="absolute h-56 w-56 lg:h-72 lg:w-72 rounded-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                style={{
                  background: "conic-gradient(from 0deg, #00d4ff, #a855f7, #ec4899, #06b6d4, #00d4ff)",
                }}
              />

              {/* Dark overlay circle that masks the center, leaving only a colored ring */}
              <div
                className="absolute h-52 w-52 lg:h-[268px] lg:w-[268px] rounded-full bg-background"
              />

              {/* Neon glow halo */}
              <div
                className="absolute h-56 w-56 lg:h-72 lg:w-72 rounded-full pointer-events-none"
                style={{
                  boxShadow: "0 0 35px rgba(0,212,255,0.4), 0 0 70px rgba(168,85,247,0.25)",
                }}
              />

              {/* Profile image */}
              <div className="relative z-10 h-52 w-52 lg:h-[268px] lg:w-[268px] rounded-full overflow-hidden shadow-2xl">
                <img
                  src="/profile.jpg"
                  alt="Eyoab Nigusie"
                  className="h-full w-full object-cover object-top"
                />
              </div>

              {/* Subtle top-left light sheen over photo */}
              <div
                className="absolute z-20 h-52 w-52 lg:h-[268px] lg:w-[268px] rounded-full pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.09) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Orbiting Tech Badges */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              {floatingTech.map((tech, i) => {
                const radius = 220; 
                const rad = (tech.angle * Math.PI) / 180;
                return (
                  <motion.div
                    key={tech.label}
                    className="absolute"
                    animate={{ rotate: [tech.angle, tech.angle + 360] }}
                    style={{
                      x: Math.cos(rad) * radius,
                      y: Math.sin(rad) * radius,
                    }}
                    transition={{
                      rotate: { duration: 30 + i * 2, repeat: Infinity, ease: "linear" },
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                      className="rounded-xl border px-4 py-2 text-xs font-semibold backdrop-blur-md"
                      style={{
                        borderColor: `${tech.color}50`,
                        backgroundColor: `${tech.color}10`,
                        color: tech.color,
                        rotate: -(tech.angle), // Keep text upright
                        boxShadow: `0 4px 20px ${tech.color}20`
                      }}
                    >
                      {tech.label}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll Hint (Bottom Center) */}
      <motion.div
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scroll</span>
        <motion.div
          className="h-12 w-6 rounded-full border-2 border-muted-foreground/30 p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="h-2 w-2 rounded-full bg-neon-cyan mx-auto"
            animate={{ y: [0, 24, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Light Rays */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-1 w-full origin-left bg-gradient-to-r from-neon-blue/0 via-neon-blue/10 to-neon-blue/0"
            style={{ transform: `rotate(${i * 60}deg)` }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </div>
    </section>
  );
}