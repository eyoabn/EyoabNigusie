import { motion, useMotionValue, useTransform, AnimatePresence } from "motion/react";
import { ExternalLink, Github, ArrowRight, Sparkles } from "lucide-react";
import { useState, useRef } from "react";
import EduConnectSimulator from "./EduConnectSimulator";

const featuredProjects = [
  {
    id: 1,
    title: "EduConnect",
    tagline: "Bridging the gap between teachers and students",
    description:
      "A comprehensive platform designed to seamlessly connect educators and learners. Features include streamlined communication, resource sharing, and interactive tools to enhance the digital learning experience.",
    longDescription:
      "EduConnect is a mobile application built to modernize education. It provides secure virtual classrooms, assignment tracking, real-time messaging, and progress monitoring, making learning more accessible and engaging for both teachers and students.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Flutter", "Dart", "Firebase", "EdTech"],
    category: "Mobile App",
    metrics: { users: "Active", status: "Completed", type: "Full-Stack" },
    featured: true,
    github: "https://github.com/eyoabn/Educonnect",
  },
  {
    id: 2,
    title: "Neural Network Visualizer",
    tagline: "Demystifying deep learning architectures",
    description:
      "An educational tool built to help students visualize and understand basic neural network architectures. Includes real-time training metrics and layer analysis to make complex ML concepts more approachable.",
    longDescription:
      "Interactive tool to visualize and understand neural networks. Features include layer visualization, gradient flow analysis, real-time training metrics, and architecture comparison.",
    image: "https://images.unsplash.com/photo-1770233621425-5d9ee7a0a700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Python", "TensorFlow", "D3.js", "WebGL"],
    category: "AI",
    metrics: { users: "Live", performance: "WebGL", status: "Open Source" },
    featured: true,
    live: "https://real-time-analytics-jh83.onrender.com/",
    github: "https://github.com/eyoabn/real-time-analytics",
  },
  {
    id: 3,
    title: "Real-Time Analytics Dashboard",
    tagline: "Enterprise-grade data visualization",
    description:
      "A fast, responsive analytics dashboard built for tracking real-time metrics. Uses WebSockets for live data streaming and D3.js for interactive, easy-to-read charts.",
    longDescription:
      "Modern web dashboard with real-time data visualization. Features include customizable widgets, advanced filtering, data export, and responsive design for all screen sizes.",
    image: "https://images.unsplash.com/photo-1753715613457-63127ec40824?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["React", "TypeScript", "WebSocket", "D3.js"],
    category: "Web",
    metrics: { users: "Internal", status: "Deployed", type: "Frontend" },
    featured: true,
  },
  {
    id: 4,
    title: "Kefit Job Matching Platform",
    tagline: "Connecting talent with opportunity",
    description:
      "A modern job matching platform that connects job seekers with employers efficiently. Features intuitive profile creation, advanced job search filters, and seamless application tracking.",
    longDescription:
      "Full-stack web application for job matching. Includes user authentication, role-based dashboards, and real-time notifications.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["React", "Node.js", "MongoDB", "Express"],
    category: "Web",
    metrics: { users: "Live", status: "Active", type: "Full-Stack" },
    featured: true,
    live: "https://kefit-job-matching-platform-1.onrender.com/",
    github: "https://github.com/eyoabn/kefit-job-matching-platform",
  },
];

const otherProjects = [
  {
    id: 5,
    title: "E-Commerce Platform",
    description: "Full-stack solution with advanced features",
    image: "https://images.unsplash.com/photo-1753715613434-9c7cb58876b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    tags: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 6,
    title: "Fitness Tracking App",
    description: "Track workouts and health metrics",
    image: "https://images.unsplash.com/photo-1758611970983-ff9f0ec0b0c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    tags: ["Flutter", "Firebase", "ML Kit"],
  },
];

function ProjectCard3D({ project, index, onViewProject }: { project: typeof featuredProjects[0]; index: number; onViewProject: (id: number) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [5, -5]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative min-w-[90vw] snap-center md:min-w-[600px] lg:min-w-[700px]"
    >
      <motion.div
        className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl"
        animate={{
          borderColor: isHovered ? "rgba(6, 182, 212, 0.5)" : "rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Spotlight Effect */}
        <motion.div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle 400px at var(--mouse-x) var(--mouse-y), rgba(0,212,255,0.15), transparent 40%)",
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Image Section */}
        <div className="relative h-64 overflow-hidden md:h-80">
          <motion.div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${project.image})`,
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
            transition={{ duration: 0.6 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />

          {/* Featured Badge */}
          <div className="absolute right-4 top-4">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-2 rounded-full border border-neon-cyan/50 bg-neon-cyan/10 px-4 py-2 backdrop-blur-lg"
            >
              <Sparkles className="h-4 w-4 text-neon-cyan" />
              <span className="text-xs text-neon-cyan">Featured</span>
            </motion.div>
          </div>

          {/* Metrics Overlay */}
          <div className="absolute bottom-4 left-4 flex gap-3">
            {Object.entries(project.metrics).map(([key, value]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-lg border border-border bg-card/80 px-3 py-1.5 backdrop-blur-lg"
              >
                <div className="text-xs text-neon-cyan">{value}</div>
                <div className="text-[10px] text-muted-foreground capitalize">{key}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Content Section */}
        <div className="relative p-8" style={{ transform: "translateZ(40px)" }}>
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-3 py-1"
          >
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-neon-purple" />
            <span className="text-xs text-neon-purple">{project.category}</span>
          </motion.div>

          {/* Title */}
          <h3 className="mb-2 text-3xl">{project.title}</h3>

          {/* Tagline */}
          <p className="mb-4 text-sm text-neon-cyan">{project.tagline}</p>

          {/* Description */}
          <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
            {isHovered ? project.longDescription : project.description}
          </p>

          {/* Tech Stack */}
          <div className="mb-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05, y: -2 }}
                className="rounded-lg border border-border bg-muted/50 px-3 py-1 text-xs backdrop-blur-sm"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={(e) => {
                e.preventDefault();
                onViewProject(project.id);
              }}
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border border-neon-cyan bg-neon-cyan/10 px-6 py-3 transition-all hover:bg-neon-cyan/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer"
            >
              <span className="text-sm text-neon-cyan">View Project</span>
              <ExternalLink className="h-4 w-4 text-neon-cyan" />
            </motion.button>

            <motion.a
              href={project.github || "#"}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 rounded-xl border border-border bg-card/50 px-6 py-3 backdrop-blur-sm transition-all hover:border-neon-blue/50"
            >
              <Github className="h-4 w-4" />
              <span className="text-sm">Source</span>
            </motion.a>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="ml-auto rounded-full border border-border bg-card/50 p-3 backdrop-blur-sm transition-all hover:border-neon-purple/50 hover:bg-neon-purple/10"
            >
              <ArrowRight className="h-5 w-5 text-neon-purple" />
            </motion.button>
          </div>
        </div>

        {/* Glow Effects */}
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-neon-blue/20 blur-[100px] transition-all group-hover:bg-neon-blue/30" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-64 w-64 rounded-full bg-neon-purple/20 blur-[100px] transition-all group-hover:bg-neon-purple/30" />
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showEduConnectSimulator, setShowEduConnectSimulator] = useState(false);

  const handleViewProject = (id: number) => {
    if (id === 1) {
      setShowEduConnectSimulator(true);
    } else {
      const project = featuredProjects.find((p) => p.id === id);
      if (project && (project as any).live) {
        window.open((project as any).live, "_blank");
      }
    }
  };

  return (
    <section id="projects" className="relative px-4 py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-blue/5 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-[90rem]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-neon-purple via-neon-blue to-neon-cyan bg-clip-text text-4xl tracking-tight text-transparent md:text-5xl">
            Featured Work
          </h2>
          <p className="mb-4 text-muted-foreground">
            Showcase of premium projects • Scroll to explore • Hover for details
          </p>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-neon-purple to-neon-cyan" />
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative mb-16">
          {/* Scroll Hint */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          >
            <ArrowRight className="h-4 w-4" />
            <span>Scroll horizontally to explore projects</span>
            <ArrowRight className="h-4 w-4" />
          </motion.div>

          {/* Scrollable Projects */}
          <div
            ref={scrollRef}
            className="no-scrollbar flex gap-8 overflow-x-auto scroll-smooth px-4 pb-8"
            style={{
              scrollSnapType: "x mandatory",
              scrollPaddingLeft: "20px",
            }}
          >
            {featuredProjects.map((project, index) => (
              <ProjectCard3D key={project.id} project={project} index={index} onViewProject={handleViewProject} />
            ))}
          </div>

          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent" />
        </div>

        {/* Other Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="mb-8 text-center text-2xl">More Projects</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {otherProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 backdrop-blur-lg transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]"
              >
                <div className="relative h-48 overflow-hidden">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${project.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                </div>

                <div className="p-6">
                  <h4 className="mb-2 text-xl">{project.title}</h4>
                  <p className="mb-4 text-sm text-muted-foreground">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border bg-muted/50 px-3 py-1 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pointer-events-none absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-neon-cyan/20 blur-3xl transition-all group-hover:bg-neon-cyan/30" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* View All Projects CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-xl border border-neon-purple bg-neon-purple/10 px-8 py-4 transition-all hover:bg-neon-purple/20 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]"
          >
            <span className="text-neon-purple">View All Projects</span>
            <ArrowRight className="h-5 w-5 text-neon-purple" />
          </motion.a>
        </motion.div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      
      <AnimatePresence>
        {showEduConnectSimulator && (
          <EduConnectSimulator onClose={() => setShowEduConnectSimulator(false)} />
        )}
      </AnimatePresence>
    </section>
  );
}
