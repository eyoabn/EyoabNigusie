import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import { LoadingScreen } from "./components/LoadingScreen";
import { Navigation } from "./components/Navigation";
import { ThemeToggle } from "./components/ThemeToggle";
import { ScrollToTop } from "./components/ScrollToTop";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollProgress } from "./components/ScrollProgress";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Experience } from "./components/Experience";
import { Testimonials } from "./components/Testimonials";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { UniverseBackground } from "./components/UniverseBackground";
export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    document.documentElement.style.scrollBehavior = "smooth";
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
