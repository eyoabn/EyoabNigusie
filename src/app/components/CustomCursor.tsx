import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Skip entirely on touch devices
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const canvas = canvasRef.current;
    if (!dot || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }
    resize();
    window.addEventListener('resize', resize);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.body.classList.add('cursor-ready');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      spawnTrailPoint(mouseX, mouseY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Trail ---
    const particles: {x: number, y: number, life: number}[] = [];
    const MAX_LIFE = 26;

    function spawnTrailPoint(x: number, y: number) {
      particles.push({ x, y, life: 0 });
    }

    let trailFrameId: number;
    function drawTrail() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        if (p.life > MAX_LIFE) {
          particles.splice(i, 1);
          continue;
        }
        const t = p.life / MAX_LIFE;
        const alpha = (1 - t) * 0.35;
        const radius = 14 * (1 - t * 0.6);

        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.shadowBlur = 18;
        ctx.shadowColor = `rgba(6, 182, 212, ${alpha})`; // --neon-cyan
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.5})`; // --neon-purple
        ctx.fill();
      }
      trailFrameId = requestAnimationFrame(drawTrail);
    }
    drawTrail();

    // Hide dot or change it when hovering clickable elements
    const handleMouseOver = (e: MouseEvent) => {
      const isClickable = (e.target as HTMLElement).closest('[data-cursor], a, button');
      if (isClickable) {
        document.body.classList.add('cursor-hovering');
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const isClickable = (e.target as HTMLElement).closest('[data-cursor], a, button');
      if (isClickable) {
        document.body.classList.remove('cursor-hovering');
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(trailFrameId);
      document.body.classList.remove('cursor-ready');
      document.body.classList.remove('cursor-hovering');
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      <style>{`
        body.cursor-ready, body.cursor-ready a, body.cursor-ready button {
          cursor: none !important;
        }

        #cursor-trail-canvas {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
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
          transition: opacity .2s ease, transform .15s ease, width .2s ease, height .2s ease, margin .2s ease;
          will-change: transform;
        }

        /* Make the dot slightly larger and semi-transparent when hovering over links */
        body.cursor-hovering .cursor-dot {
          width: 16px;
          height: 16px;
          margin: -8px 0 0 -8px;
          opacity: 0.5;
        }

        @media (hover: none), (pointer: coarse) {
          body.cursor-ready, body.cursor-ready a, body.cursor-ready button { cursor: auto !important; }
          #cursor-trail-canvas, .cursor-dot { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          #cursor-trail-canvas { display: none !important; }
        }
      `}</style>
      <canvas id="cursor-trail-canvas" ref={canvasRef}></canvas>
      <div className="cursor-dot" id="cursor-dot" ref={dotRef}></div>
    </>
  );
}
