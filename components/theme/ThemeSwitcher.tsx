"use client";

import { Laptop, Moon, Sun } from "lucide-react";

import { useTheme, type ThemeMode } from "./ThemeContext";

const themeOptions: {
  value: ThemeMode;
  label: string;
  icon: typeof Sun;
}[] = [
  {
    value: "light",
    label: "Light",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    icon: Laptop,
  },
];

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="theme-switcher"
      role="group"
      aria-label="Choose interface theme"
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            className="theme-switcher__button"
            data-active={isActive}
            onClick={() => setTheme(option.value)}
            aria-pressed={isActive}
            title={option.label}
          >
            <Icon size={16} strokeWidth={2} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}