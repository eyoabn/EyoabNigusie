import { motion } from "motion/react";
import { ArrowRight, Github, Linkedin, Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-neon-blue/10 blur-[120px]" />
        <div className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-neon-purple/10 blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 h-96 w-96 rounded-full bg-neon-cyan/10 blur-[120px]" />
      </div>

      {/* 3D Animated Element */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 md:h-96 md:w-96"
        animate={{
          rotateY: [0, 360],
          rotateX: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <div className="relative h-full w-full">
          <div
            className="absolute inset-0 rounded-3xl border-2 border-neon-blue/30 bg-gradient-to-br from-neon-blue/5 to-neon-purple/5 backdrop-blur-sm"
            style={{
              boxShadow: "0 0 60px rgba(0, 212, 255, 0.2)",
            }}
          />
          <div
            className="absolute inset-4 rounded-2xl border-2 border-neon-purple/30 bg-gradient-to-tr from-neon-purple/5 to-neon-cyan/5"
            style={{
              boxShadow: "0 0 40px rgba(168, 85, 247, 0.2)",
            }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="mb-4 inline-block rounded-full border border-neon-blue/30 bg-neon-blue/5 px-4 py-2 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-sm tracking-wider text-transparent">
              SOFTWARE ENGINEER
            </span>
          </motion.div>

          <h1 className="mb-6 bg-gradient-to-r from-foreground via-neon-blue to-neon-purple bg-clip-text text-5xl tracking-tight text-transparent md:text-7xl lg:text-8xl">
            Eyoab Nigusie
          </h1>

          <motion.p
            className="mb-8 text-lg text-muted-foreground md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Crafting innovative solutions with AI, Machine Learning & Modern Web Technologies
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.a
              href="#projects"
              className="group flex items-center gap-2 rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan px-8 py-3 transition-all hover:shadow-[0_0_30px_rgba(0,212,255,0.4)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>View Projects</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </motion.a>

            <motion.a
              href="#contact"
              className="group flex items-center gap-2 rounded-full border border-border bg-card/50 px-8 py-3 backdrop-blur-lg transition-all hover:border-neon-purple hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mail className="h-4 w-4" />
              <span>Contact Me</span>
            </motion.a>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {[
              { icon: Github, label: "GitHub" },
              { icon: Linkedin, label: "LinkedIn" },
              { icon: Mail, label: "Email" },
            ].map(({ icon: Icon, label }) => (
              <motion.a
                key={label}
                href="#"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur-lg transition-all hover:border-neon-blue hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
                whileHover={{ scale: 1.1, y: -5 }}
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Light Rays */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-1 w-full origin-left bg-gradient-to-r from-neon-blue/0 via-neon-blue/20 to-neon-blue/0"
            style={{
              transform: `rotate(${i * 45}deg)`,
            }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </section>
  );
}
