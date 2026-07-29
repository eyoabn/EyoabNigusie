/** Shown while a lazily-loaded route chunk is downloading. */
export function RouteFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background"
      role="status"
      aria-label="Loading page"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-neon-cyan" />
    </div>
  );
}
