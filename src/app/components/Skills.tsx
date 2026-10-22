import { motion } from "motion/react";
import { useState } from "react";
import { Code2, Smartphone, Server, Brain, Wrench } from "lucide-react";

interface SkillItem {
  name: string;
  level: string;
  focus: string;
}

interface SkillCategory {
  title: string;
  icon: typeof Code2;
  description: string;
  skills: SkillItem[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "Frontend & Web",
    icon: Code2,
    description: "Responsive, accessible, and fast web applications",
    skills: [
      { name: "React", level: "Advanced", focus: "Component architecture, custom hooks" },
      { name: "TypeScript", level: "Advanced", focus: "Strict type safety, interfaces, generics" },
      { name: "Next.js", level: "Proficient", focus: "App Router, SSR, SEO, performance" },
      { name: "Tailwind CSS", level: "Advanced", focus: "Design systems, responsive utilities" },
      { name: "HTML5 / CSS3", level: "Expert", focus: "Semantic markup, modern layout, grid/flex" },
      { name: "Vue.js", level: "Working", focus: "Component reactivity, state stores" },
    ],
  },
  {
    title: "Mobile Engineering",
    icon: Smartphone,
    description: "Cross-platform mobile apps for iOS and Android",
    skills: [
      { name: "Flutter", level: "Advanced", focus: "Clean Architecture, native performance" },
      { name: "Dart", level: "Advanced", focus: "Object-oriented, asynchronous streams" },
      { name: "BLoC & Provider", level: "Advanced", focus: "Predictable enterprise state management" },
      { name: "Firebase Mobile", level: "Proficient", focus: "Auth, Firestore, Cloud Functions, Messaging" },
      { name: "Material 3 & Cupertino", level: "Proficient", focus: "Platform-adaptive design patterns" },
      { name: "Offline Sync", level: "Proficient", focus: "Hive, SQLite, cached network data" },
    ],
  },
  {
    title: "Backend & Databases",
    icon: Server,
    description: "Scalable APIs, secure auth, and data modeling",
    skills: [
      { name: "Node.js", level: "Advanced", focus: "Event-driven runtime, modular services" },
      { name: "Express.js", level: "Advanced", focus: "REST APIs, middleware, security headers" },
      { name: "PostgreSQL", level: "Proficient", focus: "Relational modeling, indexing, queries" },
      { name: "MongoDB", level: "Proficient", focus: "Document schemas, aggregation pipelines" },
      { name: "RESTful Architecture", level: "Advanced", focus: "Status codes, pagination, error handling" },
      { name: "JWT & Session Auth", level: "Proficient", focus: "Role-based access control, security" },
    ],
  },
  {
    title: "AI & Applied ML",
    icon: Brain,
    description: "Machine learning integration & data pipelines",
    skills: [
      { name: "Python", level: "Advanced", focus: "Scripting, algorithmic analysis, NumPy" },
      { name: "TensorFlow & Keras", level: "Proficient", focus: "Model training, architecture visualizer" },
      { name: "PyTorch", level: "Working", focus: "Deep learning fundamentals, tensors" },
      { name: "FastAPI", level: "Proficient", focus: "High-speed Python microservices & docs" },
      { name: "Data Visualization", level: "Proficient", focus: "D3.js, charts, real-time metrics" },
    ],
  },
  {
    title: "Tools & DevOps",
    icon: Wrench,
    description: "Workflow tooling, version control, and hosting",
    skills: [
      { name: "Git & GitHub", level: "Advanced", focus: "Branching strategies, PR reviews, CI/CD" },
      { name: "Docker", level: "Working", focus: "Containerization, compose files, environments" },
      { name: "Postman", level: "Proficient", focus: "API testing, automated request suites" },
      { name: "Vercel & Render", level: "Advanced", focus: "Continuous deployment, preview branches" },
      { name: "Linux / CLI", level: "Proficient", focus: "Shell scripting, server maintenance" },
    ],
  },
];

export function Skills() {
  const [activeTab, setActiveTab] = useState<string>("All");

  const filteredCategories =
    activeTab === "All"
      ? skillCategories
      : skillCategories.filter((cat) => cat.title.toLowerCase().includes(activeTab.toLowerCase()));

  return (
    <section id="skills" className="relative px-6 py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        
        {/* Section Header */}
        <div className="mb-14 text-center">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Technical Stack
          </div>
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Skills & Expertise
          </h2>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            A comprehensive breakdown of languages, frameworks, and engineering tools I use to deliver production software.
          </p>

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {["All", "Frontend", "Mobile", "Backend", "AI", "Tools"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-medium transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "border border-border/80 bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab === "All" ? "Full Stack" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex flex-col rounded-3xl border border-border/80 bg-card p-7 shadow-xs transition-all hover:border-foreground/20 hover:shadow-md"
            >
              {/* Category Header */}
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <cat.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {cat.description}
                  </p>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-3 flex-1">
                {cat.skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="rounded-xl border border-border/50 bg-muted/40 p-3 transition-colors hover:bg-muted/70"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-foreground">
                        {skill.name}
                      </span>
                      <span className="rounded-md border border-border/60 bg-card px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {skill.level}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug">
                      {skill.focus}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
