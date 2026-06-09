import { LoadingScreen } from "../components/LoadingScreen";
import { Navigation } from "../components/Navigation";
import { ThemeToggle } from "../components/ThemeToggle";
import { ScrollToTop } from "../components/ScrollToTop";
import { CustomCursor } from "../components/CustomCursor";
import { ScrollProgress } from "../components/ScrollProgress";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Projects } from "../components/Projects";
import { Skills } from "../components/Skills";
import { Experience } from "../components/Experience";
import { Testimonials } from "../components/Testimonials";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { UniverseBackground } from "../components/UniverseBackground";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";

export function Home() {
  const [loading, setLoading] = useState(true);

  // Add portfolio-page class so custom cursor CSS applies here only
  useEffect(() => {
    document.body.classList.add("portfolio-page");
    document.documentElement.classList.add("dark");
    document.documentElement.style.scrollBehavior = "smooth";

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest("a");
      if (anchor) {
        const href = anchor.getAttribute("href");
        // Check if it's a page anchor link (starts with # and is not a route like #/admin)
        if (href && href.startsWith("#") && !href.startsWith("#/")) {
          e.preventDefault();
          const id = href.substring(1);
          if (id === "") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            const el = document.getElementById(id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }
        }
      }
    };

    window.addEventListener("click", handleGlobalClick);

    return () => {
      document.body.classList.remove("portfolio-page");
      window.removeEventListener("click", handleGlobalClick);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen onLoadingComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {!loading && (
        <div className="relative min-h-screen bg-background text-foreground">
          <UniverseBackground />
          <ScrollProgress />
          <CustomCursor />
          <Navigation />
          <ThemeToggle />
          <ScrollToTop />

          <main className="relative z-10">
            <Hero />
            <About />
            <Projects />
            <Skills />
            <Experience />
            <Testimonials />
            <Contact />
          </main>

          <div className="relative z-10">
            <Footer />
          </div>
        </div>
      )}
    </>
  );
}
