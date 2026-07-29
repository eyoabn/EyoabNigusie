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

const BOOT_FLAG = "portfolio-boot-shown";

function shouldShowBootScreen() {
  // A 3-second intro is charming once, tedious on every navigation back to the
  // page — and it's pure decoration to anyone who asked for reduced motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  try {
    return sessionStorage.getItem(BOOT_FLAG) !== "1";
  } catch {
    return true;
  }
}

export function Home() {
  const [loading, setLoading] = useState(shouldShowBootScreen);

  const finishLoading = () => {
    setLoading(false);
    try {
      sessionStorage.setItem(BOOT_FLAG, "1");
    } catch {
      // Non-fatal: the intro just plays again next time.
    }
  };

  useEffect(() => {
    // Scopes the custom-cursor CSS to the portfolio page so /admin keeps a normal cursor.
    document.body.classList.add("portfolio-page");

    const handleGlobalClick = (e: MouseEvent) => {
      // Let modified clicks (new tab, download, etc.) behave normally.
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      // Only handle in-page section links: "#about". A bare "#" is a placeholder,
      // and "#/..." would be a route — neither should hijack the scroll position.
      if (!href || !href.startsWith("#") || href === "#" || href.startsWith("#/")) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
      // Keep the URL shareable and the section focusable for keyboard users.
      history.replaceState(null, "", href);
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
        {loading && <LoadingScreen onLoadingComplete={finishLoading} />}
      </AnimatePresence>

      {/* The page is always mounted — the loading screen overlays it rather than
          gating it, so content is painted and crawlable from the first frame. */}
      <div className="relative min-h-screen bg-background text-foreground">
        <UniverseBackground />
        <ScrollProgress />
        <CustomCursor />
        <Navigation />
        <ThemeToggle />
        <ScrollToTop />

        <main id="main" className="relative z-10">
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
    </>
  );
}
