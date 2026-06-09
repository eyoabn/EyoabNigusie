import { motion, useMotionValue, useTransform } from "motion/react";
import { useState, useRef, useEffect } from "react";

interface Skill {
  name: string;
  level: number;
  category: string;
  x: number;
  y: number;
  color: string;
  related: string[];
}

const skillsData: Skill[] = [
  // AI/ML Cluster (top-left quadrant)
  { name: "Python", level: 95, category: "AI/ML", x: 15, y: 20, color: "neon-cyan", related: ["TensorFlow", "PyTorch", "scikit-learn"] },
  { name: "TensorFlow", level: 88, category: "AI/ML", x: 25, y: 15, color: "neon-cyan", related: ["Python", "PyTorch", "Keras"] },
  { name: "PyTorch", level: 85, category: "AI/ML", x: 20, y: 30, color: "neon-cyan", related: ["Python", "TensorFlow", "Computer Vision"] },
  { name: "NLP", level: 82, category: "AI/ML", x: 10, y: 35, color: "neon-cyan", related: ["Python", "TensorFlow"] },
  { name: "Computer Vision", level: 80, category: "AI/ML", x: 30, y: 25, color: "neon-cyan", related: ["PyTorch", "Python"] },

  // Frontend Cluster (top-right quadrant)
  { name: "React", level: 92, category: "Frontend", x: 75, y: 20, color: "neon-blue", related: ["TypeScript", "Next.js", "Tailwind"] },
  { name: "TypeScript", level: 90, category: "Frontend", x: 85, y: 15, color: "neon-blue", related: ["React", "Node.js", "Next.js"] },
  { name: "Next.js", level: 88, category: "Frontend", x: 80, y: 30, color: "neon-blue", related: ["React", "TypeScript", "Node.js"] },
  { name: "Tailwind", level: 93, category: "Frontend", x: 70, y: 35, color: "neon-blue", related: ["React", "CSS", "UI/UX"] },
  { name: "Vue.js", level: 78, category: "Frontend", x: 90, y: 25, color: "neon-blue", related: ["TypeScript", "React"] },

  // Mobile Cluster (bottom-left quadrant)
  { name: "Flutter", level: 90, category: "Mobile", x: 15, y: 70, color: "neon-purple", related: ["Dart", "Firebase", "iOS"] },
  { name: "Dart", level: 89, category: "Mobile", x: 25, y: 75, color: "neon-purple", related: ["Flutter", "Firebase"] },
  { name: "React Native", level: 82, category: "Mobile", x: 20, y: 85, color: "neon-purple", related: ["React", "TypeScript", "iOS"] },
  { name: "iOS", level: 75, category: "Mobile", x: 10, y: 80, color: "neon-purple", related: ["Swift", "Flutter", "React Native"] },
  { name: "Android", level: 76, category: "Mobile", x: 30, y: 80, color: "neon-purple", related: ["Flutter", "Kotlin"] },

  // Backend/Cloud Cluster (bottom-right quadrant)
  { name: "Node.js", level: 87, category: "Backend", x: 75, y: 70, color: "neon-pink", related: ["TypeScript", "PostgreSQL", "AWS"] },
  { name: "PostgreSQL", level: 85, category: "Backend", x: 85, y: 75, color: "neon-pink", related: ["Node.js", "GraphQL"] },
  { name: "AWS", level: 83, category: "Backend", x: 80, y: 85, color: "neon-pink", related: ["Docker", "Node.js", "Kubernetes"] },
  { name: "Docker", level: 88, category: "Backend", x: 70, y: 80, color: "neon-pink", related: ["Kubernetes", "AWS", "CI/CD"] },
  { name: "GraphQL", level: 84, category: "Backend", x: 90, y: 78, color: "neon-pink", related: ["Node.js", "PostgreSQL", "TypeScript"] },

  // Center connections
  { name: "Git", level: 95, category: "Tools", x: 50, y: 50, color: "neon-cyan", related: ["GitHub", "CI/CD"] },
  { name: "UI/UX", level: 85, category: "Design", x: 45, y: 40, color: "neon-blue", related: ["Figma", "Tailwind"] },
  { name: "Figma", level: 88, category: "Design", x: 55, y: 40, color: "neon-blue", related: ["UI/UX", "Design Systems"] },
  { name: "Firebase", level: 82, category: "Backend", x: 45, y: 60, color: "neon-pink", related: ["Flutter", "Node.js"] },
  { name: "MongoDB", level: 81, category: "Backend", x: 55, y: 60, color: "neon-pink", related: ["Node.js", "Express"] },
];

export function Skills() {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, []);

  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      "neon-cyan": "#06b6d4",
      "neon-blue": "#00d4ff",
      "neon-purple": "#a855f7",
      "neon-pink": "#ec4899",
    };
    return colors[color] || colors["neon-blue"];
  };

  const isRelated = (skill: Skill, hoveredSkillName: string | null) => {
    if (!hoveredSkillName) return false;
    return skill.name === hoveredSkillName || skill.related.includes(hoveredSkillName);
  };

  return (
    <section id="skills" className="relative px-4 py-32">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-neon-purple/5 blur-[120px] animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-neon-cyan/5 blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 bg-gradient-to-r from-neon-cyan via-neon-blue to-neon-purple bg-clip-text text-4xl tracking-tight text-transparent md:text-5xl">
            Skills Universe
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Interactive neural network of expertise • Hover or Tap & Hold a skill to focus its connections (other skills will fade out and back)
          </p>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-neon-cyan to-neon-purple" />
        </motion.div>

        {/* Neural Network Visualization */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative mx-auto aspect-[16/10] max-w-6xl overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card/50 to-card/20 backdrop-blur-xl"
        >
          {/* Connection Lines */}
          <svg className="absolute inset-0 h-full w-full">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {skillsData.map((skill) =>
              skill.related.map((relatedName) => {
                const relatedSkill = skillsData.find((s) => s.name === relatedName);
                if (!relatedSkill) return null;

                const isActive = hoveredSkill === skill.name || hoveredSkill === relatedName;
                const opacity = hoveredSkill === null ? 0.1 : isActive ? 0.6 : 0.02;

                return (
                  <motion.line
                    key={`${skill.name}-${relatedName}`}
                    x1={`${skill.x}%`}
                    y1={`${skill.y}%`}
                    x2={`${relatedSkill.x}%`}
                    y2={`${relatedSkill.y}%`}
                    stroke={isActive ? getColorClass(skill.color) : "#ffffff"}
                    strokeWidth={isActive ? "2" : "1"}
                    initial={{ opacity: 0.1 }}
                    animate={{ opacity }}
                    transition={{ duration: 0.3 }}
                    filter={isActive ? "url(#glow)" : undefined}
                  />
                );
              })
            )}

            {/* Animated particles along connections when hovered */}
            {hoveredSkill &&
              skillsData
                .find((s) => s.name === hoveredSkill)
                ?.related.map((relatedName) => {
                  const skill = skillsData.find((s) => s.name === hoveredSkill);
                  const relatedSkill = skillsData.find((s) => s.name === relatedName);
                  if (!skill || !relatedSkill) return null;

                  return (
                    <motion.circle
                      key={`particle-${skill.name}-${relatedName}`}
                      r="3"
                      fill={getColorClass(skill.color)}
                      filter="url(#glow)"
                      initial={{ cx: `${skill.x}%`, cy: `${skill.y}%` }}
                      animate={{
                        cx: [`${skill.x}%`, `${relatedSkill.x}%`],
                        cy: [`${skill.y}%`, `${relatedSkill.y}%`],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  );
                })}
          </svg>

          {/* Skill Nodes */}
          {skillsData.map((skill, index) => {
            const isHovered = hoveredSkill === skill.name;
            const isConnected = hoveredSkill !== null && isRelated(skill, hoveredSkill);
            const shouldHighlight = hoveredSkill === null || isHovered || isConnected;
            const nodeSize = isHovered ? 24 : 16;
            const labelOpacity = hoveredSkill === null ? 0.7 : shouldHighlight ? 1 : 0.2;

            return (
              <motion.div
                key={skill.name}
                className="absolute"
                style={{
                  left: `${skill.x}%`,
                  top: `${skill.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.02 }}
                onHoverStart={() => setHoveredSkill(skill.name)}
                onHoverEnd={() => setHoveredSkill(null)}
                onTouchStart={() => setHoveredSkill(skill.name)}
                onTouchEnd={() => setHoveredSkill(null)}
              >
                {/* Outer Glow Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    width: nodeSize * 3,
                    height: nodeSize * 3,
                    left: "50%",
                    top: "50%",
                    x: "-50%",
                    y: "-50%",
                    background: `radial-gradient(circle, ${getColorClass(skill.color)}20 0%, transparent 70%)`,
                  }}
                  animate={{
                    scale: isHovered ? [1, 1.3, 1] : 1,
                    opacity: isHovered ? 0.8 : shouldHighlight ? 0.4 : 0.1,
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Node Circle */}
                <motion.div
                  className="relative rounded-full border-2 backdrop-blur-sm"
                  style={{
                    width: nodeSize,
                    height: nodeSize,
                    borderColor: getColorClass(skill.color),
                    backgroundColor: `${getColorClass(skill.color)}40`,
                    boxShadow: shouldHighlight
                      ? `0 0 20px ${getColorClass(skill.color)}80`
                      : "none",
                  }}
                  animate={{
                    scale: isHovered ? 1.5 : 1,
                    borderWidth: isHovered ? 3 : 2,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Pulsing Inner Core */}
                  <motion.div
                    className="absolute inset-0 m-auto h-2 w-2 rounded-full"
                    style={{ backgroundColor: getColorClass(skill.color) }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>

                {/* Skill Label */}
                <motion.div
                  className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg border border-border bg-card/90 px-3 py-1.5 backdrop-blur-lg"
                  animate={{
                    opacity: labelOpacity,
                    y: isHovered ? 0 : 4,
                    scale: isHovered ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    boxShadow: isHovered
                      ? `0 0 20px ${getColorClass(skill.color)}40`
                      : "none",
                  }}
                >
                  <div className="text-xs">{skill.name}</div>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="mt-1 border-t border-border pt-1 text-[10px] text-muted-foreground"
                    >
                      {skill.category} • {skill.level}% proficiency
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            );
          })}

          {/* Interactive Spotlight Effect */}
          <motion.div
            className="pointer-events-none absolute h-64 w-64 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)",
              left: mousePosition.x - 128,
              top: mousePosition.y - 128,
            }}
          />

          {/* Category Legend */}
          <div className="absolute bottom-4 left-4 flex flex-wrap gap-3">
            {["AI/ML", "Frontend", "Mobile", "Backend", "Design", "Tools"].map((category) => {
              const categorySkills = skillsData.filter((s) => s.category === category);
              if (categorySkills.length === 0) return null;
              const color = getColorClass(categorySkills[0].color);

              return (
                <div key={category} className="flex items-center gap-2 rounded-lg border border-border bg-card/80 px-3 py-1.5 backdrop-blur-lg">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 8px ${color}`,
                    }}
                  />
                  <span className="text-xs text-muted-foreground">{category}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 grid gap-6 md:grid-cols-4"
        >
          {[
            { label: "Technologies", value: skillsData.length, color: "neon-cyan" },
            { label: "Categories", value: "6+", color: "neon-blue" },
            { label: "GitHub Commits", value: "1K+", color: "neon-purple" },
            { label: "Projects Built", value: "15+", color: "neon-pink" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-6 text-center backdrop-blur-lg transition-all hover:border-neon-cyan/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <div className={`mb-2 bg-gradient-to-r from-${stat.color} to-transparent bg-clip-text text-4xl text-transparent`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon-cyan/10 blur-2xl transition-all group-hover:bg-neon-cyan/20" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
