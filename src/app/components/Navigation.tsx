import { motion, useScroll } from "motion/react";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "#", id: "" },
  { label: "About", href: "#about", id: "about" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Skills", href: "#skills", id: "skills" },
  { label: "Experience", href: "#experience", id: "experience" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export function Navigation() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const { scrollY } = useScroll();

  // Helper for smooth scrolling on anchor links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href && href.startsWith("#") && !href.startsWith("#/")) {
      e.preventDefault();
      const id = href.substring(1);
      if (id === "") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          // Move focus with the scroll, otherwise a keyboard user is scrolled to
          // the section but their next Tab resumes inside the nav they just left.
          if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      }
    }
  };

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsVisible(latest > 100);
    });
  }, [scrollY]);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    const sectionIds = navItems.map((item) => item.id).filter(Boolean);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl cursor-none"
      aria-label="Main"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <motion.a
          href="#"
          className="bg-gradient-to-r from-neon-blue to-neon-purple bg-clip-text text-xl tracking-tight text-transparent"
          whileHover={{ scale: 1.05 }}
        >
          EN
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <motion.a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                // The colour change alone doesn't reach a screen reader.
                aria-current={isActive ? "true" : undefined}
                className="relative rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                style={{ color: isActive ? "var(--neon-cyan)" : "var(--muted-foreground)" }}
                whileHover={{ y: -2 }}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-neon-cyan"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.a>
            );
          })}
        </div>

        {/* Hire Me CTA */}
        <div className="hidden md:block">
          <motion.a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan px-5 py-2 text-sm font-medium text-background transition-all hover:shadow-[0_0_20px_rgba(0,212,255,0.4)]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Hire Me
          </motion.a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded md:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {/* A collapsed height of 0 hides the links visually but leaves them in the
          tab order, so focus vanishes into an invisible menu. Flipping visibility
          once the collapse finishes takes them out of it without losing the
          animation — visibility can't be hidden during the slide or the menu
          would disappear instantly instead of sliding away. */}
      <motion.div
        id="mobile-menu"
        initial={{ height: 0, visibility: "hidden" }}
        animate={
          isMobileMenuOpen
            ? { height: "auto", visibility: "visible" }
            : { height: 0, transitionEnd: { visibility: "hidden" } }
        }
        className="overflow-hidden border-t border-border md:hidden"
      >
        <div className="space-y-4 p-4">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => {
                handleNavClick(e, item.href);
                setIsMobileMenuOpen(false);
              }}
              aria-current={activeSection === item.id ? "true" : undefined}
              className="block rounded text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{
                color:
                  activeSection === item.id
                    ? "var(--neon-cyan)"
                    : "var(--muted-foreground)",
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={(e) => {
              handleNavClick(e, "#contact");
              setIsMobileMenuOpen(false);
            }}
            className="block w-full rounded-full bg-gradient-to-r from-neon-blue to-neon-cyan py-2 text-center text-sm font-medium text-background"
          >
            Hire Me
          </a>
        </div>
      </motion.div>
    </motion.nav>
  );
}
