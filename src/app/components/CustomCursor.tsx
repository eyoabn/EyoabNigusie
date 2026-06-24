import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const ringLabelRef = useRef<HTMLSpanElement>(null);

  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Skip entirely on touch devices
    const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
    if (isTouchDevice) {
      setIsTouch(true);
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const ringLabel = ringLabelRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !ringLabel || !canvas) return;

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
    let ringX = mouseX, ringY = mouseY;
    let animationFrameId: number;

    document.body.classList.add('cursor-ready');

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      spawnTrailPoint(mouseX, mouseY);
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Ring: eased follow ---
    function animateRing() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ring) {
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      }
      animationFrameId = requestAnimationFrame(animateRing);
    }
    animateRing();

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

    // Event delegation for hover states
    const handleMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      const isClickable = (e.target as HTMLElement).closest('a, button');
      
      if (target) {
        ring.classList.add('is-hovering');
        document.body.classList.add('cursor-hovering');
        ringLabel.textContent = target.getAttribute('data-cursor') || '';
      } else if (isClickable) {
        ring.classList.add('is-hovering');
        document.body.classList.add('cursor-hovering');
        ringLabel.textContent = '';
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor], a, button');
      if (target) {
        ring.classList.remove('is-hovering');
        document.body.classList.remove('cursor-hovering');
        ringLabel.textContent = '';
      }
    };

    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
      cancelAnimationFrame(animationFrameId);
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
          transition: opacity .2s ease, transform .15s ease;
          will-change: transform;
        }

        .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          width: 38px; height: 38px;
          margin: -19px 0 0 -19px;
          border-radius: 50%;
          border: 1.5px solid var(--neon-cyan);
          pointer-events: none;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: width .35s cubic-bezier(.22,1,.36,1), height .35s cubic-bezier(.22,1,.36,1),
                      margin .35s cubic-bezier(.22,1,.36,1), border-color .35s ease,
                      background-color .35s ease;
          will-change: transform;
        }

        .cursor-ring span {
          opacity: 0;
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          letter-spacing: .04em;
          color: var(--background);
          text-transform: uppercase;
          transition: opacity .2s ease;
          white-space: nowrap;
        }

        .cursor-ring.is-hovering {
          width: 84px; height: 84px;
          margin: -42px 0 0 -42px;
          background-color: var(--neon-cyan);
          border-color: var(--neon-cyan);
        }
        .cursor-ring.is-hovering span { opacity: 1; }
        body.cursor-hovering .cursor-dot { opacity: 0; }

        @media (hover: none), (pointer: coarse) {
          body.cursor-ready, body.cursor-ready a, body.cursor-ready button { cursor: auto !important; }
          #cursor-trail-canvas, .cursor-dot, .cursor-ring { display: none !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          #cursor-trail-canvas { display: none !important; }
        }
      `}</style>
      <canvas id="cursor-trail-canvas" ref={canvasRef}></canvas>
      <div className="cursor-dot" id="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" id="cursor-ring" ref={ringRef}>
        <span id="cursor-ring-label" ref={ringLabelRef}></span>
      </div>
    </>
  );
}
