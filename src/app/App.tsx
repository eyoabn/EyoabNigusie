import { BrowserRouter, Routes, Route } from "react-router";
import { lazy, Suspense } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./lib/theme";
import { Home } from "./pages/Home";
import { RouteFallback } from "./components/RouteFallback";

// The admin dashboard is only ever opened by one person — keeping it out of the
// main bundle means visitors to the portfolio never download it.
const Admin = lazy(() => import("./pages/Admin").then((m) => ({ default: m.Admin })));
const NotFound = lazy(() => import("./pages/NotFound").then((m) => ({ default: m.NotFound })));

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--card)",
            border: "1px solid var(--border)",
            color: "var(--foreground)",
          },
        }}
      />
    </ThemeProvider>
  );
}
