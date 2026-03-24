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
      borderRadius: 0,
      border: "2px solid #111111",
      cursor: "pointer",
      fontWeight: 900,
      fontSize: 13,
      background: isActive ? "#d92d20" : "#fff8ea",
      color: isActive ? "#fff8ea" : "#111111",
      boxShadow: "4px 4px 0 rgba(17,17,17,0.9)",
      transition: "0.2s",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
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
