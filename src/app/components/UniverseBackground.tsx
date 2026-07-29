import { useEffect, useRef } from "react";
import { useTheme } from "../lib/theme";

/** Upper bound on stars regardless of screen size — a 4K display would otherwise
 *  ask for thousands of draw calls per frame for no visual gain. */
const MAX_STARS = 320;
const MIN_STARS = 90;

/** Bright specks read well on a dark sky; on a light background they need to be
 *  darker and cooler or the canvas looks empty. */
const PALETTES = {
  dark: ["#ffffff", "#e0f7fa", "#fff9c4", "#f3e5f5"],
  light: ["#64748b", "#7dd3fc", "#a5b4fc", "#94a3b8"],
} as const;

type Star = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  opacitySpeed: number;
  color: string;
};

export function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = PALETTES[resolvedTheme];
    const maxOpacity = resolvedTheme === "dark" ? 1 : 0.55;

    let stars: Star[] = [];
    let w = 0;
    let h = 0;
    let animationFrameId = 0;
    let resizeTimer: number | undefined;

    const makeStar = (): Star => ({
      x: Math.random() * w,
      y: Math.random() * h,
      // Varying sizes for depth (some tiny, some a bit larger)
      size: Math.random() * 1.5 + 0.3,
      // Very slow movement for a majestic universe feel
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * maxOpacity,
      opacitySpeed: Math.random() * 0.015 + 0.005,
      color: palette[Math.floor(Math.random() * palette.length)],
    });

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;

      // Match the backing store to the device pixel ratio so stars aren't blurry
      // on high-DPI screens, then work in CSS pixels for the rest of the code.
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale with the square root of area rather than area itself: a screen with
      // 4x the pixels gets 2x the stars, not 4x.
      const density = Math.round(Math.sqrt(w * h) / 4);
      const count = Math.max(MIN_STARS, Math.min(MAX_STARS, density));

      stars = Array.from({ length: count }, makeStar);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const star of stars) {
        ctx.globalAlpha = Math.max(0, Math.min(maxOpacity, star.opacity));
        ctx.fillStyle = star.color;

        // A sub-pixel arc() is visually identical to a rect but costs far more —
        // most of the field is drawn with the cheap path.
        if (star.size < 1) {
          ctx.fillRect(star.x, star.y, star.size * 2, star.size * 2);
        } else {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const animate = () => {
      for (const star of stars) {
        star.x += star.speedX;
        star.y += star.speedY;

        // Twinkling effect
        star.opacity += star.opacitySpeed;
        if (star.opacity > maxOpacity || star.opacity < 0.1) {
          star.opacitySpeed = -star.opacitySpeed;
        }

        // Wrap around screen edges
        if (star.x < 0) star.x = w;
        if (star.x > w) star.x = 0;
        if (star.y < 0) star.y = h;
        if (star.y > h) star.y = 0;
      }

      draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    const start = () => {
      if (animationFrameId) return;
      animationFrameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = 0;
    };

    // A background tab shouldn't burn CPU and battery drawing an invisible canvas.
    const handleVisibility = () => {
      if (document.hidden) stop();
      else if (!reduceMotion) start();
    };

    // Rebuilding the whole star field on every resize event makes dragging a
    // window edge janky — wait until the drag settles.
    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        init();
        if (reduceMotion) draw();
      }, 150);
    };

    init();

    if (reduceMotion) {
      // Render a still starfield: the atmosphere survives, the motion doesn't.
      draw();
    } else {
      start();
    }

    window.addEventListener("resize", handleResize);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
      stop();
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 0 }}
    />
  );
}
