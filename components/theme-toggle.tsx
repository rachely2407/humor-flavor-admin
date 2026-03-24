"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!mounted) return null;

  const active = theme ?? resolvedTheme ?? "system";

  function pill(isActive: boolean) {
    return {
      padding: "8px 14px",
      borderRadius: 999,
      border: "1px solid var(--border)",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: 13,
      background: isActive
        ? "linear-gradient(135deg, var(--primary), #f472b6)"
        : "rgba(255,255,255,0.55)",
      color: isActive ? "white" : "var(--foreground)",
      boxShadow: "var(--shadow-soft)",
      transition: "0.2s",
    } as React.CSSProperties;
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button
        style={pill(active === "light")}
        onClick={() => setTheme("light")}
      >
        ☀ Light
      </button>

      <button
        style={pill(active === "dark")}
        onClick={() => setTheme("dark")}
      >
        🌙 Dark
      </button>

      <button
        style={pill(active === "system")}
        onClick={() => setTheme("system")}
      >
        💻 System
      </button>
    </div>
  );
}
