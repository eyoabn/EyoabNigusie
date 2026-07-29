import { useEffect, useRef, useState } from "react";

const MAX_LIFE = 26;
/** Hard cap so a fast flick across a wide monitor can't queue up hundreds of sprites. */
const MAX_PARTICLES = 60;
/** Don't drop a new trail point until the pointer has actually travelled a bit. */
const MIN_SPAWN_DISTANCE = 6;
const SPRITE_SIZE = 64;

type Particle = { x: number; y: number; life: number };

/**
 * Draws the glow once into an offscreen canvas. Blitting this sprite per particle
 * is dramatically cheaper than re-running a blur or building a gradient every frame.
 */
function createGlowSprite(): HTMLCanvasElement {
  const sprite = document.createElement("canvas");
  sprite.width = SPRITE_SIZE;
  sprite.height = SPRITE_SIZE;

  const sctx = sprite.getContext("2d");
  if (sctx) {
    const c = SPRITE_SIZE / 2;
    const gradient = sctx.createRadialGradient(c, c, 0, c, c, c);
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.85)"); // --neon-cyan core
    gradient.addColorStop(0.4, "rgba(168, 85, 247, 0.35)"); // --neon-purple mid
    gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
    sctx.fillStyle = gradient;
    sctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  }
  return sprite;
}

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Skip entirely on touch devices and for anyone who asked for reduced motion.
    const isTouchDevice = window.matchMedia("(hover: none), (pointer: coarse)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouchDevice || reduceMotion) return;

    setIsEnabled(true);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const dot = dotRef.current;
    const canvas = canvasRef.current;
    if (!dot || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const glow = createGlowSprite();

    let w = 0;
    let h = 0;
    let frameId = 0;
    let resizeTimer: number | undefined;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const handleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };
    window.addEventListener("resize", handleResize);

    let mouseX = w / 2;
    let mouseY = h / 2;
    let lastSpawnX = mouseX;
    let lastSpawnY = mouseY;
    let dotDirty = false;

    document.body.classList.add("cursor-ready");

    // The handler stays trivial: a gaming mouse can fire this 1000x/second, so
    // all real work is deferred to the animation frame below.
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dotDirty = true;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const particles: Particle[] = [];

    const drawTrail = () => {
      if (dotDirty) {
        dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        dotDirty = false;
      }

      // Spawning here rather than in the move handler naturally caps the rate at
      // one particle per frame (~60/s) instead of one per mouse event.
      const dx = mouseX - lastSpawnX;
      const dy = mouseY - lastSpawnY;
      if (dx * dx + dy * dy > MIN_SPAWN_DISTANCE * MIN_SPAWN_DISTANCE) {
        particles.push({ x: mouseX, y: mouseY, life: 0 });
        if (particles.length > MAX_PARTICLES) particles.shift();
        lastSpawnX = mouseX;
        lastSpawnY = mouseY;
      }

      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > MAX_LIFE) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / MAX_LIFE;
        const size = 34 * (1 - t * 0.6);

        ctx.globalAlpha = (1 - t) * 0.5;
        ctx.drawImage(glow, p.x - size / 2, p.y - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      frameId = requestAnimationFrame(drawTrail);
    };

    const start = () => {
      if (!frameId) frameId = requestAnimationFrame(drawTrail);
    };
    const stop = () => {
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const handleVisibility = () => {
      if (document.hidden) {
        stop();
        particles.length = 0;
      } else {
        start();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    start();

    // Grow the dot over anything clickable so the cursor still signals affordance.
    const handleMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-cursor], a, button")) {
        document.body.classList.add("cursor-hovering");
      }
    };
    const handleMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("[data-cursor], a, button")) {
        document.body.classList.remove("cursor-hovering");
      }
    };
    document.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("visibilitychange", handleVisibility);
      stop();
      document.body.classList.remove("cursor-ready", "cursor-hovering");
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <>
      <style>{`
        body.cursor-ready, body.cursor-ready a, body.cursor-ready button {
          cursor: none !important;
        }

        #cursor-trail-canvas {
          position: fixed;
          top: 0; left: 0;
          pointer-events: none;
          z-index: 9998;
        }

        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          width: 8px; height: 8px;
          margin: -4px 0 0 -4px;
          border-radius: 50%;
          background: var(--neon-cyan);
          pointer-events: none;
          z-index: 9999;
          transition: opacity .2s ease, width .2s ease, height .2s ease, margin .2s ease;
          will-change: transform;
        }

        /* Larger and semi-transparent over links, so the target stays readable. */
        body.cursor-hovering .cursor-dot {
          width: 20px;
          height: 20px;
          margin: -10px 0 0 -10px;
          opacity: 0.5;
        }

        @media (hover: none), (pointer: coarse) {
          body.cursor-ready, body.cursor-ready a, body.cursor-ready button { cursor: auto !important; }
          #cursor-trail-canvas, .cursor-dot { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          #cursor-trail-canvas, .cursor-dot { display: none !important; }
          body.cursor-ready, body.cursor-ready a, body.cursor-ready button { cursor: auto !important; }
        }
      `}</style>
      <canvas id="cursor-trail-canvas" ref={canvasRef} aria-hidden="true"></canvas>
      <div className="cursor-dot" id="cursor-dot" ref={dotRef} aria-hidden="true"></div>
    </>
  );
}
