import { HashRouter, Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { Admin } from "./pages/Admin";

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}
