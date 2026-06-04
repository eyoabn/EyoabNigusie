import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "David Chen",
    role: "Engineering Manager",
    company: "TechFlow",
    avatar: "DC",
    color: "#00d4ff",
    rating: 5,
    text: "Eyoab is a highly dedicated engineer. He quickly grasps complex requirements and consistently delivers clean, maintainable code. His recent work on our frontend architecture noticeably improved our team's deployment speed.",
  },
  {
    name: "Sarah Jenkins",
    role: "Startup Founder",
    company: "EduSphere",
    avatar: "SJ",
    color: "#a855f7",
    rating: 5,
    text: "We brought Eyoab on to build our initial MVP. He was communicative, transparent about technical trade-offs, and delivered a solid Flutter application that our early users really enjoy. Highly recommend working with him.",
  },
  {
    name: "Dr. Robert Lin",
    role: "Technical Lead",
    company: "DataSync",
    avatar: "RL",
    color: "#ec4899",
    rating: 5,
    text: "What stands out about Eyoab is his curiosity and problem-solving mindset. Give him a difficult bug or a new framework, and he'll dive deep until he masters it. He's a great asset to any collaborative engineering team.",
  },
  {
    name: "Amanda Rivera",
    role: "Product Manager",
    company: "CloudScale",
    avatar: "AR",
    color: "#06b6d4",
    rating: 5,
    text: "Eyoab is reliable and proactive. Whenever we faced unexpected technical hurdles, he was always the first to propose practical solutions. He communicates his progress well and always keeps the project's goals in mind.",
  },
  {
    name: "Michael Chang",
    role: "Senior Developer",
    company: "WebNova",
    avatar: "MC",
    color: "#a855f7",
    rating: 5,
    text: "I've had the pleasure of pair programming with Eyoab on multiple occasions. He writes thoughtful, well-documented code and is always open to constructive feedback. He genuinely cares about the quality of the product he builds.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-neon-cyan text-neon-cyan" />
      ))}
    </div>
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = (dir: number) => {
    setIsAutoPlaying(false);
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="relative px-4 py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/3 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-neon-purple/5 blur-[120px]" />
        <div className="absolute right-1/4 top-1/4 h-64 w-64 rounded-full bg-neon-cyan/5 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-4xl tracking-tight text-transparent md:text-5xl">
            What People Say
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
          <p className="mt-6 text-sm text-muted-foreground">
            Trusted by engineers, founders, and researchers worldwide
          </p>
        </motion.div>

        {/* Main Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 80 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-xl md:p-12"
              style={{
                boxShadow: `0 0 60px ${t.color}15`,
                borderColor: `${t.color}30`,
              }}
            >
              {/* Glow */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[80px]"
                style={{ backgroundColor: `${t.color}15` }}
              />

              {/* Quote Icon */}
              <div className="mb-6">
                <Quote
                  className="h-10 w-10 opacity-30"
                  style={{ color: t.color }}
                />
              </div>

              {/* Text */}
              <blockquote className="mb-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
                "{t.text}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-background"
                    style={{
                      background: `linear-gradient(135deg, ${t.color}, ${t.color}80)`,
                      boxShadow: `0 0 20px ${t.color}40`,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-medium" style={{ color: t.color }}>
                      {t.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
                <StarRating count={t.rating} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className="h-2 rounded-full transition-all"
                  style={{
                    width: i === current ? "24px" : "8px",
                    backgroundColor: i === current ? testimonials[i].color : "rgba(255,255,255,0.2)",
                  }}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-3">
              <motion.button
                onClick={() => navigate(-1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-lg transition-all hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft className="h-5 w-5" />
              </motion.button>
              <motion.button
                onClick={() => navigate(1)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-lg transition-all hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(0,212,255,0.2)]"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronRight className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mini Cards Row */}
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { label: "Code Quality", value: "Clean & Scalable", color: "#00d4ff" },
            { label: "Communication", value: "Transparent", color: "#a855f7" },
            { label: "Problem Solving", value: "Proactive", color: "#ec4899" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-card/30 p-4 text-center backdrop-blur-lg"
              style={{ borderColor: `${stat.color}20` }}
              whileHover={{ y: -4 }}
            >
              <div
                className="mb-1 text-3xl font-medium"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
