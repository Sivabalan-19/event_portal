"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    try {
      return localStorage.getItem("theme") || "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <div className="theme-toggle" aria-hidden={false}>
      <button
        onClick={toggle}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        className="btn-primary"
        style={{ padding: "0.4rem 0.6rem", fontSize: "0.9rem" }}
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}
