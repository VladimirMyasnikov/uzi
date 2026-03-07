"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultTheme, themes, ThemeName } from "@/config/themes";

type ThemeCtx = {
  theme: ThemeName;
  setTheme: (v: ThemeName) => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem("theme") as ThemeName) || defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    const values = themes[theme];
    Object.entries(values).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    root.dataset.theme = theme;
    root.style.colorScheme = theme === "dark" ? "dark" : "light";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeMode must be used within ThemeProvider");
  }
  return ctx;
}

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useThemeMode();
  const items: { mode: ThemeName; label: string; icon: string }[] = [
    { mode: "light", label: "Светлая", icon: "☀️" },
    { mode: "dark", label: "Тёмная", icon: "🌙" },
  ];

  return (
    <div
      className="flex items-center gap-2 rounded-full border px-2 py-1 text-xs font-semibold backdrop-blur"
      style={{
        borderColor: "var(--border)",
        background: "var(--card)",
        boxShadow: "var(--shadow)",
      }}
      aria-label="Переключение темы"
    >
      {items.map((item) => (
        <button
          key={item.mode}
          onClick={() => setTheme(item.mode)}
          className={`flex items-center gap-1 rounded-full px-2.5 py-1.5 transition ${
            theme === item.mode
              ? "bg-[color:var(--fg)] text-white shadow-sm"
              : "text-[color:var(--muted)] hover:bg-[color:var(--card)]"
          }`}
          aria-pressed={theme === item.mode}
          type="button"
        >
          <span aria-hidden>{item.icon}</span>
          {!compact && <span className="hidden sm:inline">{item.label}</span>}
        </button>
      ))}
    </div>
  );
}

