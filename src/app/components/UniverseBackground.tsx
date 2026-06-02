import { useEffect, useRef } from "react";

export function UniverseBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;

    class Star {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      opacitySpeed: number;
      color: string;

      constructor(w: number, h: number) {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        // Varying sizes for depth (some tiny, some a bit larger)
        this.size = Math.random() * 1.5 + 0.3;
        // Very slow movement for a majestic universe feel
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random();
        this.opacitySpeed = (Math.random() * 0.015) + 0.005;
        
        // Slight color variations (white, light blue, pale yellow, pale purple)
        const colors = ['#ffffff', '#e0f7fa', '#fff9c4', '#f3e5f5'];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update(w: number, h: number) {
        this.x += this.speedX;
        this.y += this.speedY;

        // Twinkling effect
        this.opacity += this.opacitySpeed;
        if (this.opacity > 1 || this.opacity < 0.1) {
          this.opacitySpeed = -this.opacitySpeed;
        }

        // Wrap around screen edges
        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.globalAlpha = Math.max(0, Math.min(1, this.opacity));
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    let stars: Star[] = [];
    let w = window.innerWidth;
    let h = window.innerHeight;

    const init = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;

      stars = [];
      const numStars = Math.floor((w * h) / 1500); // Star density
      for (let i = 0; i < numStars; i++) {
        stars.push(new Star(w, h));
      }
    };

    const animate = () => {
      // Clear the canvas each frame (background remains transparent)
      ctx.clearRect(0, 0, w, h);

      stars.forEach((star) => {
        star.update(w, h);
        star.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      init();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none hidden dark:block"
      style={{ zIndex: 0 }}
    />
  );
}
