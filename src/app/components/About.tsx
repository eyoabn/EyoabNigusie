import { motion, useInView } from "motion/react";
import { Code2, Sparkles, Rocket } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function useCountUp(target: number, duration = 2000, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 60;
    const increment = target / steps;
    const stepTime = duration / steps;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

function AnimatedStat({
  value,
  suffix,
  label,
  color,
}: {
  value: number;
  suffix: string;
  label: string;
  color: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 1800, inView);
  return (
    <div ref={ref} className="text-center">
      <div className="mb-1 text-2xl" style={{ color }}>
        {count}{suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function About() {
  const skills = [
    { name: "Python", level: 95 },
    { name: "Flutter/Dart", level: 90 },
    { name: "Machine Learning", level: 88 },
    { name: "React/TypeScript", level: 92 },
    { name: "Cloud Architecture", level: 85 },
  ];

  const highlights = [
    {
      icon: Code2,
      title: "Full-Stack Developer",
      description: "Building scalable applications with modern tech stacks",
    },
    {
      icon: Sparkles,
      title: "AI Enthusiast",
      description: "Creating intelligent solutions with ML and deep learning",
    },
    {
      icon: Rocket,
      title: "Innovation Driven",
      description: "Passionate about cutting-edge technology and best practices",
    },
  ];

  return (
    <section id="about" className="relative px-4 py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-4xl tracking-tight text-transparent md:text-5xl">
            About Me
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple" />
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card/40 p-8 backdrop-blur-2xl transition-all hover:border-neon-blue/60 hover:shadow-[0_0_50px_rgba(0,212,255,0.25)]"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-neon-blue/10 blur-3xl transition-all group-hover:bg-neon-blue/20" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-6">
                {/* Profile Image Placeholder with gradient avatar */}
                <div className="relative h-24 w-24 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-neon-blue/30 bg-gradient-to-br from-neon-blue/30 to-neon-purple/30 shadow-[0_0_20px_rgba(0,212,255,0.3)] flex items-center justify-center p-0.5">
                    <img src="/profile.jpg" alt="Eyoab Nigusie" className="h-full w-full object-cover rounded-xl" />
                  </div>
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-card bg-green-500">
                    <div className="h-2 w-2 rounded-full bg-green-300 animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="mb-1 text-2xl">Eyoab Nigusie</h3>
                  <p className="text-sm bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-transparent font-medium">Software Engineer & ML Enthusiast</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-green-400">Available for work</span>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-4">
                <p className="leading-relaxed text-muted-foreground">
                  Passionate software engineer dedicated to building cutting-edge applications and solving real-world problems.
                  Specialized in <span className="text-neon-blue font-medium">AI/ML</span>, mobile development with <span className="text-neon-purple font-medium">Flutter</span>, and modern web technologies.
                </p>
                <div className="pl-4 border-l-2 border-neon-cyan/50 text-sm text-muted-foreground/90 italic">
                  "I thrive on turning complex challenges into elegant, efficient, and user-centric digital experiences."
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-black/20 border border-white/5">
                <AnimatedStat value={15} suffix="+" label="Projects Built" color="#00d4ff" />
                <AnimatedStat value={5} suffix="+" label="Core Techs" color="#a855f7" />
                <AnimatedStat value={100} suffix="%" label="Commitment" color="#06b6d4" />
              </div>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {skills.map((skill, index) => (
              <div key={skill.name}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm">{skill.name}</span>
                  <span className="text-sm text-neon-blue">{skill.level}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-neon-blue to-neon-purple"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
                    style={{ boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)" }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid gap-6 md:grid-cols-3"
        >
          {highlights.map((highlight) => (
            <motion.div
              key={highlight.title}
              whileHover={{ y: -5 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-lg transition-all hover:border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-purple/10 blur-2xl transition-all group-hover:bg-neon-purple/20" />
              <div className="relative">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-neon-blue/20 to-neon-purple/20">
                  <highlight.icon className="h-6 w-6 text-neon-blue" />
                </div>
                <h4 className="mb-2">{highlight.title}</h4>
                <p className="text-sm text-muted-foreground">{highlight.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
