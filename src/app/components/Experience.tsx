import { motion } from "motion/react";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    type: "work",
    title: "Full-Stack Software Engineer",
    company: "Freelance & Independent Projects",
    period: "2024 - Present",
    description:
      "Architecting and deploying production-ready full-stack applications, AI tools, and cross-platform mobile apps.",
    achievements: [
      "Built and deployed an interactive deep learning platform using FastAPI, React, and TensorFlow",
      "Engineered an educational mobile platform (EduConnect) using Flutter, Dart, and Node.js",
      "Developed a real-time job matching system with WebSockets and JWT authentication",
    ],
  },
  {
    type: "work",
    title: "Mobile App Developer",
    company: "Personal Projects",
    period: "2023 - 2024",
    description:
      "Focused on cross-platform mobile development, mastering Flutter and Firebase to build intuitive apps.",
    achievements: [
      "Mastered Material 3 design principles for seamless UI/UX",
      "Integrated secure authentication and cloud databases",
      "Transitioned from mobile-only to full-stack web and AI development",
    ],
  },
  {
    type: "education",
    title: "B.Sc. in Software Engineering",
    company: "Adama Science and Technology University",
    period: "Class of 2028",
    description: "Currently in my third year, focusing on advanced software architecture, algorithms, and full-stack development.",
    achievements: [
      "Consistent academic excellence while building production-grade software independently",
      "Completed advanced coursework in AI & Machine Learning via self-directed learning",
      "Actively applying theoretical knowledge to real-world, open-source projects",
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className="relative px-4 py-32">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-neon-pink to-neon-blue bg-clip-text text-4xl tracking-tight text-transparent md:text-5xl">
            Experience & Education
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-neon-pink to-neon-blue" />
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-neon-blue via-neon-purple to-neon-cyan md:left-1/2" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex items-center gap-8 ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Timeline Dot */}
                <div className="absolute left-8 flex h-4 w-4 items-center justify-center md:left-1/2 md:-translate-x-1/2">
                  <div
                    className={`h-4 w-4 rounded-full border-2 ${
                      exp.type === "work"
                        ? "border-neon-blue bg-neon-blue/20"
                        : "border-neon-purple bg-neon-purple/20"
                    } shadow-[0_0_15px_rgba(0,212,255,0.5)]`}
                  />
                </div>

                {/* Content */}
                <div className="ml-20 w-full md:ml-0 md:w-[calc(50%-3rem)]">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-lg transition-all hover:border-neon-purple/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                  >
                    {/* Glow Effect */}
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-purple/10 blur-2xl transition-all group-hover:bg-neon-purple/20" />

                    <div className="relative">
                      {/* Icon */}
                      <div
                        className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg ${
                          exp.type === "work"
                            ? "bg-neon-blue/20 text-neon-blue"
                            : "bg-neon-purple/20 text-neon-purple"
                        }`}
                      >
                        {exp.type === "work" ? (
                          <Briefcase className="h-5 w-5" />
                        ) : (
                          <GraduationCap className="h-5 w-5" />
                        )}
                      </div>

                      {/* Period */}
                      <div className="mb-2 text-sm text-neon-cyan">{exp.period}</div>

                      {/* Title & Company */}
                      <h3 className="mb-1">{exp.title}</h3>
                      <div className="mb-3 text-sm text-muted-foreground">{exp.company}</div>

                      {/* Description */}
                      <p className="mb-4 text-sm text-muted-foreground">{exp.description}</p>

                      {/* Achievements */}
                      <div className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neon-blue" />
                            <span className="text-sm text-muted-foreground">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Spacer for desktop */}
                <div className="hidden w-[calc(50%-3rem)] md:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
