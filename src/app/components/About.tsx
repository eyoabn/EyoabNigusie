import { motion, useInView } from "motion/react";
import { Code2, Smartphone, Database } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function useCountUp(target: number, duration = 1600, inView = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const steps = 40;
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
}: {
  value: number;
  suffix: string;
  label: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(value, 1500, inView);
  return (
    <div ref={ref} className="text-center p-3 rounded-xl bg-card border border-border/60 shadow-xs">
      <div className="mb-1 text-2xl font-bold tracking-tight text-foreground">
        {count}{suffix}
      </div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

export function About() {
  const competencies = [
    { name: "Full-Stack Web Development", tier: "Primary Focus", focus: "React, Next.js, TypeScript, REST APIs & Tailwind CSS" },
    { name: "Cross-Platform Mobile Apps", tier: "Production Ready", focus: "Flutter & Dart with Clean Architecture & BLoC" },
    { name: "Backend Systems & Databases", tier: "Core Foundation", focus: "Node.js, Express, PostgreSQL, MongoDB & Auth" },
    { name: "Applied Machine Learning & Python", tier: "Applied Focus", focus: "FastAPI, TensorFlow, ML data visualization" },
    { name: "Deployment & DevOps Workflow", tier: "Active Workflow", focus: "Vercel, Render, Docker & Git CI/CD pipelines" },
  ];

  const highlights = [
    {
      icon: Code2,
      title: "Full-Stack Web Engineering",
      description: "Crafting scalable, accessible web applications from reactive frontends to resilient database schemas.",
    },
    {
      icon: Smartphone,
      title: "Mobile Craft with Flutter",
      description: "Delivering native-performance cross-platform iOS and Android apps with thoughtful, tactile UX.",
    },
    {
      icon: Database,
      title: "Pragmatic Architecture",
      description: "Prioritizing clean code, maintainability, type safety, and real-world performance over trends.",
    },
  ];

  return (
    <section id="about" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-6xl">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Get To Know Me
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About Me
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            A software engineer dedicated to building reliable digital products with modern technologies.
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12 items-start">
          
          {/* Left Column: Personal Narrative & Profile (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm lg:col-span-7"
          >
            <div className="mb-6 flex items-center gap-5">
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-muted">
                <img
                  src="/profile.jpg"
                  alt="Eyoab Nigusie"
                  className="h-full w-full object-cover object-top"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Eyoab Nigusie</h3>
                <p className="text-sm font-medium text-muted-foreground">
                  Software Engineering Student @ ASTU
                </p>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Adama, Ethiopia</span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
              <p>
                I am a third-year Software Engineering undergraduate at <strong className="font-semibold text-foreground">Adama Science and Technology University (ASTU)</strong>. I love turning complex engineering problems into simple, fast, and reliable digital experiences.
              </p>
              <p>
                Over the past several years, I have engineered diverse software systems — ranging from mobile edtech platforms (<strong className="font-semibold text-foreground">EduConnect</strong>) to full-featured corporate websites and real-time machine learning visualizers.
              </p>
              <div className="rounded-xl border-l-2 border-primary bg-muted/40 p-4 text-sm italic text-foreground/90">
                "I focus on writing readable code, designing sensible architectures, and creating software that users genuinely enjoy using."
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-8 grid grid-cols-3 gap-3 border-t border-border/60 pt-6">
              <AnimatedStat value={15} suffix="+" label="Projects Built" />
              <AnimatedStat value={4} suffix="+" label="Years of Focus" />
              <AnimatedStat value={100} suffix="%" label="Dedicated Execution" />
            </div>
          </motion.div>

          {/* Right Column: Practical Competencies (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4 lg:col-span-5"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold tracking-tight text-foreground">
                Technical Proficiencies
              </h3>
              <p className="text-xs text-muted-foreground">
                Core technologies I work with day in and day out
              </p>
            </div>

            {competencies.map((comp) => (
              <div
                key={comp.name}
                className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs transition-colors hover:border-foreground/20"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-foreground">{comp.name}</span>
                  <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {comp.tier}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{comp.focus}</p>
              </div>
            ))}
          </motion.div>

        </div>

        {/* 3 Value Pillars */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="rounded-2xl border border-border/80 bg-card p-6 shadow-2xs transition-all hover:shadow-sm"
            >
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <highlight.icon className="h-5 w-5" />
              </div>
              <h4 className="mb-2 text-base font-bold text-foreground">{highlight.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">{highlight.description}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
