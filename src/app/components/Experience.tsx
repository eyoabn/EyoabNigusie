import { motion } from "motion/react";
import { Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";

const experiences = [
  {
    type: "work",
    title: "Full-Stack Software Engineer",
    company: "Freelance & Independent Client Projects",
    period: "2024 — Present",
    description:
      "Architecting and shipping responsive full-stack applications, interactive web platforms, and mobile apps for clients and independent initiatives.",
    achievements: [
      "Engineered EduConnect — an interactive mobile learning platform using Flutter, Dart, and Firebase",
      "Developed e-commerce & portfolio platform for Arenguade Eco Paper with Next.js and Tailwind CSS",
      "Built real-time deep learning visualization tools with React, FastAPI, and TensorFlow",
    ],
  },
  {
    type: "work",
    title: "Mobile App Developer",
    company: "Independent Mobile Development",
    period: "2023 — 2024",
    description:
      "Focused on cross-platform mobile engineering, mastering Flutter state management and backend integration.",
    achievements: [
      "Implemented clean architectural patterns with BLoC and Riverpod for scalable mobile codebases",
      "Designed platform-adaptive interfaces compliant with Material 3 and iOS human guidelines",
      "Integrated Firebase Authentication, Cloud Firestore, and offline local cache persistence",
    ],
  },
  {
    type: "education",
    title: "B.Sc. in Software Engineering",
    company: "Adama Science and Technology University (ASTU)",
    period: "Class of 2028 (Third Year)",
    description:
      "Pursuing a rigorous degree in Software Engineering, studying algorithms, data structures, system architecture, and software design principles.",
    achievements: [
      "Maintaining strong academic standing while shipping production-grade open source projects",
      "Applied theoretical computer science directly to real-world full-stack web and mobile systems",
      "Active participant in developer circles and collaborative technical peer groups",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-4xl">
        
        {/* Section Header */}
        <div className="mb-16 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Career Journey
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Experience & Education
          </h2>
          <p className="mx-auto max-w-xl text-base text-muted-foreground">
            A chronological timeline of my academic background and hands-on software engineering work.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Track */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-border md:left-1/2 md:-translate-x-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-6 md:gap-12 items-start ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot Marker */}
                <div className="absolute left-4 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card shadow-xs md:left-1/2">
                  {exp.type === "work" ? (
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                  ) : (
                    <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  )}
                </div>

                {/* Card Container */}
                <div className="ml-10 w-[calc(100%-2.5rem)] md:ml-0 md:w-[calc(50%-2rem)]">
                  <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-colors hover:border-foreground/20">
                    {/* Period Badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full border border-border/60 bg-muted/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {exp.period}
                      </span>
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        {exp.type === "work" ? "Experience" : "Education"}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold tracking-tight text-foreground">
                      {exp.title}
                    </h3>
                    <div className="text-sm font-medium text-muted-foreground mb-3">
                      {exp.company}
                    </div>

                    <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                      {exp.description}
                    </p>

                    <div className="space-y-2 border-t border-border/50 pt-3">
                      {exp.achievements.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0 text-emerald-500 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Desktop Spacer */}
                <div className="hidden w-[calc(50%-2rem)] md:block" />
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
