export type ThemeName = "light" | "dark";

export const themes: Record<ThemeName, Record<string, string>> = {
  light: {
    "--bg": "#f5f7fb",
    "--fg": "#0b1324",
    "--card": "#ffffff",
    "--muted": "#5b6479",
    "--border": "#d8e2ef",
    "--primary": "#0f172a",
    "--accent": "#2563eb",
    "--accent-soft": "#e7efff",
    "--radius": "16px",
    "--shadow": "0 16px 50px rgba(15,23,42,0.12)",
    "--grad-start": "#f7faff",
    "--grad-end": "#edf2ff",
  },
  dark: {
    "--bg": "#050915",
    "--fg": "#e6e9f2",
    "--card": "#0f172a",
    "--muted": "#9aa3b5",
    "--border": "#1f2937",
    "--primary": "#e6e9f2",
    "--accent": "#60a5fa",
    "--accent-soft": "#132545",
    "--radius": "16px",
    "--shadow": "0 16px 50px rgba(0,0,0,0.55)",
    "--grad-start": "#050914",
    "--grad-end": "#0c1428",
  },
};

export const defaultTheme: ThemeName = "light";

