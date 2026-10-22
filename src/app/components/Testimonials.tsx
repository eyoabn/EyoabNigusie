import { motion, AnimatePresence } from "motion/react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect } from "react";

const testimonials = [
  {
    name: "Abebe Tadesse",
    role: "Project Director",
    company: "Enjefo Construction",
    avatar: "AT",
    rating: 5,
    text: "Eyoab developed our company's corporate web presence with remarkable precision. The site is fast, modern, and accurately reflects our architectural brand. His communication throughout the milestone deliverables was top-notch.",
  },
  {
    name: "Hana Girma",
    role: "Brand & Operations Lead",
    company: "Arenguade Eco Paper",
    avatar: "HG",
    rating: 5,
    text: "The web and portfolio platform Eyoab engineered for our sustainable packaging brand exceeded our expectations. Our customers love the clean interface, and the performance across mobile and desktop is seamless.",
  },
  {
    name: "Bereket Michael",
    role: "Software Engineering Peer",
    company: "ASTU Developer Circle",
    avatar: "BM",
    rating: 5,
    text: "Working alongside Eyoab on full-stack projects is a masterclass in dedication. He has a firm grasp of TypeScript, Flutter clean architecture, and proactively solves bottlenecks before they affect the team.",
  },
  {
    name: "Samuel Bekele",
    role: "EdTech Contributor",
    company: "EduConnect Initiative",
    avatar: "SB",
    rating: 5,
    text: "Eyoab architected the mobile client for EduConnect with deep care for intuitive UX and real-time state synchronization. He consistently turns complex feature specs into clean, maintainable software.",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
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
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const navigate = (dir: number) => {
    setIsAutoPlaying(false);
    setDirection(dir);
    setCurrent((c) => (c + dir + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Testimonials
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Collaborators Say
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            Feedback from team members, clients, and fellow engineering peers.
          </p>
        </div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 40 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="rounded-3xl border border-border/80 bg-card p-8 shadow-sm md:p-12"
            >
              <div className="mb-6 flex items-center justify-between">
                <Quote className="h-8 w-8 text-muted-foreground/30" />
                <StarRating count={t.rating} />
              </div>

              <blockquote className="mb-8 text-lg leading-relaxed text-foreground/90 md:text-xl font-normal">
                "{t.text}"
              </blockquote>

              <div className="flex items-center gap-4 border-t border-border/50 pt-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-muted font-bold text-foreground">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-bold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t.role} • {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-between">
            {/* Dot Indicators */}
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    i === current ? "w-6 bg-primary" : "w-2 bg-muted hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-2">
              <button
                onClick={() => navigate(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted active:scale-95 cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => navigate(1)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground transition-colors hover:bg-muted active:scale-95 cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
