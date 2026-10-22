import { motion } from "motion/react";
import { Github, ArrowUpRight, Smartphone, Sparkles } from "lucide-react";
import { useState, lazy, Suspense } from "react";

const EduConnectSimulator = lazy(() => import("./EduConnectSimulator"));

const IMAGE_WIDTHS = [480, 720, 1080, 1440];

function buildSrcSet(url: string) {
  if (!/[?&]w=\d+/.test(url)) return undefined;
  return IMAGE_WIDTHS.map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`).join(", ");
}

const IMAGE_SIZES = "(min-width: 1024px) 50vw, 100vw";

interface Project {
  id: number;
  title: string;
  tagline: string;
  description: string;
  image: string;
  tags: string[];
  category: "Web" | "Mobile App" | "AI";
  featured?: boolean;
  live?: string;
  github?: string;
  hasSimulator?: boolean;
}

const projectsList: Project[] = [
  {
    id: 1,
    title: "EduConnect",
    tagline: "Bridging the gap between teachers, students, and classrooms",
    description:
      "A cross-platform mobile educational platform engineered with Flutter and Firebase. Features virtual classrooms, assignment workflows, real-time messaging, and student progress tracking.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Flutter", "Dart", "Firebase", "EdTech", "BLoC"],
    category: "Mobile App",
    featured: true,
    github: "https://github.com/eyoabn/Educonnect",
    hasSimulator: true,
  },
  {
    id: 9,
    title: "Arenguade Eco Paper (Green Bag)",
    tagline: "Sustainable Packaging & Craft Academy Platform",
    description:
      "A complete e-commerce and portfolio web application for Addis Ababa's manufacturer of biodegradable artisan kraft bags. Features bespoke packaging configurator and masterclass booking.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Three.js"],
    category: "Web",
    featured: true,
    live: "https://green-bag-five.vercel.app/",
    github: "https://github.com/eyoabn/green-bag",
  },
  {
    id: 10,
    title: "Based Education",
    tagline: "Interactive Live Learning & Community Platform",
    description:
      "Full-stack Next.js web application providing structured courses, community discussions, role-based dashboards, and live video class integration with responsive dark and light modes.",
    image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    category: "Web",
    featured: true,
    live: "https://based-education.vercel.app/",
    github: "https://github.com/eyoabn/based-education",
  },
  {
    id: 2,
    title: "Neural Network Visualizer",
    tagline: "Interactive Deep Learning & Layer Analytics Tool",
    description:
      "An educational web application for exploring neural network architectures in real time. Features gradient flow analysis, weight histograms, and live training progress metrics.",
    image: "https://images.unsplash.com/photo-1770233621425-5d9ee7a0a700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Python", "TensorFlow", "React", "FastAPI", "D3.js"],
    category: "AI",
    featured: true,
    live: "https://real-time-analytics-jh83.onrender.com/",
    github: "https://github.com/eyoabn/real-time-analytics",
  },
  {
    id: 3,
    title: "Enjefo Construction",
    tagline: "Corporate Web Presence for Engineering & Construction",
    description:
      "A fast, modern corporate web showcase for a premier construction and architecture firm in Addis Ababa. Highlights architectural project portfolios, service breakdowns, and inquiries.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "SEO"],
    category: "Web",
    featured: true,
    live: "https://enjefo-construction.vercel.app/",
  },
  {
    id: 4,
    title: "Kefit Job Matching Platform",
    tagline: "Connecting Talent with Tech Opportunities",
    description:
      "Full-stack web application facilitating talent discovery and job matching. Features multi-role authentication, application tracking, resume parsing, and instant notifications.",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
    tags: ["React", "Node.js", "MongoDB", "Express", "JWT"],
    category: "Web",
    featured: true,
    live: "https://kefit-job-matching-platform-1.onrender.com/",
    github: "https://github.com/eyoabn/kefit-job-matching-platform",
  },
  {
    id: 5,
    title: "Modern E-Commerce Engine",
    tagline: "Full-Stack Digital Store & Checkout",
    description:
      "Full-stack store platform with real-time inventory management, product filtering, cart persistence, and administrative order dashboard.",
    image: "https://images.unsplash.com/photo-1753715613434-9c7cb58876b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    tags: ["React", "Node.js", "Express", "MongoDB"],
    category: "Web",
    github: "https://github.com/eyoabn",
  },
  {
    id: 6,
    title: "Fitness & Habit Tracker",
    tagline: "Cross-Platform Mobile Routine Companion",
    description:
      "Flutter mobile app engineered for tracking daily wellness habits, workouts, and biometrics with offline persistence and progress heatmaps.",
    image: "https://images.unsplash.com/photo-1758611970983-ff9f0ec0b0c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
    tags: ["Flutter", "Dart", "Firebase", "BLoC"],
    category: "Mobile App",
    github: "https://github.com/eyoabn",
  },
];

export function Projects() {
  const [filter, setFilter] = useState<string>("All");
  const [showEduConnectSimulator, setShowEduConnectSimulator] = useState(false);

  const categories = ["All", "Web", "Mobile App", "AI"];

  const filteredProjects =
    filter === "All"
      ? projectsList
      : projectsList.filter((p) => p.category === filter);

  return (
    <section id="projects" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-border/60 pb-8">
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Portfolio
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Selected Projects
            </h2>
            <p className="mt-2 max-w-xl text-base text-muted-foreground">
              A curated selection of production web applications, cross-platform mobile apps, and tools I've designed and built.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                  filter === cat
                    ? "bg-foreground text-background shadow-xs font-semibold"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat === "All" ? "All Projects" : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-xs transition-all hover:border-foreground/20 hover:shadow-md"
            >
              {/* Project Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <img
                  src={project.image}
                  srcSet={buildSrcSet(project.image)}
                  sizes={IMAGE_SIZES}
                  alt={`${project.title} preview`}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.srcset = "";
                    target.src =
                      "https://images.unsplash.com/photo-1544816155-12df9643f363?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200";
                  }}
                />

                {/* Category Pill */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full border border-black/10 bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
                    {project.category}
                  </span>
                </div>

                {/* Featured Badge */}
                {project.featured && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-xs backdrop-blur-md">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      Featured
                    </span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-7">
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-primary">
                    {project.tagline}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-5">
                  {/* Tags */}
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-border/60 bg-muted/60 px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Simulator Trigger */}
                    {project.hasSimulator && (
                      <button
                        onClick={() => setShowEduConnectSimulator(true)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 active:scale-95 cursor-pointer"
                      >
                        <Smartphone className="h-3.5 w-3.5" />
                        <span>Try Simulator</span>
                      </button>
                    )}

                    {/* Live Demo Link */}
                    {project.live && (
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs transition-opacity hover:opacity-90 active:scale-95"
                      >
                        <span>Live Site</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </a>
                    )}

                    {/* Source Code Link */}
                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-medium text-foreground transition-colors hover:bg-muted active:scale-95"
                      >
                        <Github className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>Source</span>
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">
                        Proprietary / Client Project
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Simulator Modal */}
      <Suspense fallback={null}>
        {showEduConnectSimulator && (
          <EduConnectSimulator onClose={() => setShowEduConnectSimulator(false)} />
        )}
      </Suspense>
    </section>
  );
}
