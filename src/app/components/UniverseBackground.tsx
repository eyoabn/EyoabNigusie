import { useTheme } from "../lib/theme";

/**
 * A clean, subtle dot grid background.
 * Zero glowing blur blobs, zero distracting animations.
 */
export function UniverseBackground() {
  const { resolvedTheme } = useTheme();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 0 }}
    >
      {/* Subtle craft dot grid pattern */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          backgroundImage:
            resolvedTheme === "dark"
              ? "radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)"
              : "radial-gradient(rgba(15, 23, 42, 0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 50%, transparent 95%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 50% 30%, black 50%, transparent 95%)",
        }}
      />
    </div>
  );
}
