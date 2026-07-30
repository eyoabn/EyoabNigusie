/**
 * Base URL of the portfolio backend.
 *
 * Vite inlines `import.meta.env.VITE_API_URL` at BUILD time, not at run time, so
 * the value has to be present in the build environment. It lives in `.env`,
 * which is gitignored and therefore never reaches the host — the production
 * bundle was compiled with the fallback and shipped pointing at
 * `http://localhost:5000`. Every API call then went to the visitor's own machine
 * and failed twice over: nothing is listening there, and an HTTPS page is not
 * allowed to make a plaintext request anyway. It surfaced only as an
 * unreachable backend, which reads like a server outage rather than a build
 * misconfiguration.
 *
 * So the fallback resolves by host instead: localhost keeps talking to a local
 * API, anything else uses the deployed one. That mirrors the backend, which
 * hardcodes its own SITE_ORIGINS allowlist after unset configuration silently
 * broke the live site the same way. Setting VITE_API_URL still overrides this,
 * which is what a custom domain or a preview deployment needs.
 */
const DEPLOYED_API_URL = "https://portfolio-backend-6ac0.onrender.com";
const LOCAL_API_URL = "http://localhost:5000";

const LOCAL_HOSTS = ["localhost", "127.0.0.1", "[::1]", ""];

function resolveApiUrl(): string {
  const configured = import.meta.env.VITE_API_URL?.trim();
  // A trailing slash would produce "//api/contact" once callers append a path.
  if (configured) return configured.replace(/\/+$/, "");

  const hostname = typeof window === "undefined" ? "" : window.location.hostname;
  return LOCAL_HOSTS.includes(hostname) ? LOCAL_API_URL : DEPLOYED_API_URL;
}

export const API_URL = resolveApiUrl();
