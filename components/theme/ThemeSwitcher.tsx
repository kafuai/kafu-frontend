"use client";

import { Laptop, Moon, Sun } from "lucide-react";

import { useTheme, type ThemeMode } from "./ThemeContext";

const themeOrder: ThemeMode[] = ["system", "light", "dark"];

const themeConfig: Record<
  ThemeMode,
  {
    label: string;
    icon: typeof Sun;
  }
> = {
  system: {
    label: "System theme",
    icon: Laptop,
  },
  light: {
    label: "Light theme",
    icon: Sun,
  },
  dark: {
    label: "Dark theme",
    icon: Moon,
  },
};

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const currentIndex = themeOrder.indexOf(theme);
  const nextTheme =
    themeOrder[(currentIndex + 1) % themeOrder.length];

  const CurrentIcon = themeConfig[theme].icon;

  return (
    <button
      type="button"
      className="compact-control"
      onClick={() => setTheme(nextTheme)}
      aria-label={`${themeConfig[theme].label}. Switch to ${themeConfig[nextTheme].label}.`}
      title={`${themeConfig[theme].label} — switch to ${themeConfig[nextTheme].label}`}
    >
      <CurrentIcon size={18} strokeWidth={2} />

      <span className="sr-only">
        {themeConfig[theme].label}
      </span>
    </button>
  );
}
