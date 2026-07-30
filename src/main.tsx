import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";

/**
 * Accept hash-style route URLs and hand them to BrowserRouter as real paths.
 *
 * The static host serves files, so a request for /admin returns 404 before any
 * JavaScript runs unless a rewrite rule sends unmatched paths to index.html.
 * A URL like /#/admin always loads, because the path it requests is just "/".
 * Normalising the hash here means that form reaches the right route instead of
 * silently rendering the home page — BrowserRouter matches on pathname and
 * ignores the fragment, which is why /#/admin looked like the portfolio.
 *
 * Only "#/"-prefixed fragments are treated as routes. In-page section anchors
 * ("#projects", "#main") must keep working as anchors, the same distinction
 * Home.tsx makes when it intercepts scroll links.
 */
const hash = window.location.hash;
if (hash.startsWith("#/")) {
  window.history.replaceState(null, "", hash.slice(1) + window.location.search);
}

createRoot(document.getElementById("root")!).render(<App />);
