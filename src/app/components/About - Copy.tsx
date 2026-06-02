import { motion } from "motion/react";
import { Code2, Sparkles, Rocket } from "lucide-react";

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
            className="group relative overflow-hidden rounded-3xl border border-border bg-card/50 p-8 backdrop-blur-lg transition-all hover:border-neon-blue/50 hover:shadow-[0_0_40px_rgba(0,212,255,0.2)]"
          >
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-neon-blue/10 blur-3xl transition-all group-hover:bg-neon-blue/20" />
            <div className="relative">
              <div className="mb-6 flex items-center gap-6">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-neon-blue/30 bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 shadow-[0_0_20px_rgba(0,212,255,0.3)]" />
                <div>
                  <h3 className="mb-1 text-2xl">Eyoab Nigusie</h3>
                  <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
                </div>
              </div>
              <p className="mb-6 leading-relaxed text-muted-foreground">
                Passionate software engineer with 5+ years of experience building cutting-edge applications.
                Specialized in AI/ML, mobile development with Flutter, and modern web technologies.
                I love turning complex problems into elegant, efficient solutions.
              </p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="mb-1 text-2xl text-neon-blue">50+</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div>
                  <div className="mb-1 text-2xl text-neon-purple">5+</div>
                  <div className="text-xs text-muted-foreground">Years</div>
                </div>
                <div>
                  <div className="mb-1 text-2xl text-neon-cyan">100%</div>
                  <div className="text-xs text-muted-foreground">Dedication</div>
                </div>
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
                    transition={{ duration: 1, delay: index * 0.1 }}
                    style={{
                      boxShadow: "0 0 10px rgba(0, 212, 255, 0.5)",
                    }}
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
          {highlights.map((highlight, index) => (
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
