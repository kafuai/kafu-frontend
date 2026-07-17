"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AppLocale = "ar" | "en";
export type AppDirection = "rtl" | "ltr";

type TranslationDictionary = Record<string, string>;

interface LocalizationContextValue {
  locale: AppLocale;
  direction: AppDirection;
  setLocale: (locale: AppLocale) => void;
  toggleLocale: () => void;
  t: (key: string) => string;
}

const translations: Record<AppLocale, TranslationDictionary> = {
  ar: {
    "brand.name": "KAFU AI",
    "brand.description": "ط·آ¸أ¢â‚¬آ ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¹آ¾ط·آ·ط¢آ´ط·آ·ط·â€؛ط·آ¸ط¸آ¹ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¤ط·آ·ط¢آ³ط·آ·ط¢آ³ط·آ¸ط¸آ¹ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¯ط·آ·ط¢آ¹ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ¦ ط·آ·ط¢آ¨ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ°ط·آ¸ط¦â€™ط·آ·ط¢آ§ط·آ·ط·إ’ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ§ط·آ·ط¢آµط·آ·ط¢آ·ط·آ¸أ¢â‚¬آ ط·آ·ط¢آ§ط·آ·ط¢آ¹ط·آ¸ط¸آ¹",

    "common.active": "ط·آ¸أ¢â‚¬آ ط·آ·ط¢آ´ط·آ·ط¢آ·",
    "common.phase": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ·ط¢آ­ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ«ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ ط·آ¸ط¸آ¹ط·آ·ط¢آ©",
    "common.search": "ط·آ·ط¢آ¨ط·آ·ط¢آ­ط·آ·ط¢آ«",
    "common.notifications": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ´ط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¹آ¾",
    "common.settings": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¥ط·آ·ط¢آ¹ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¹آ¾",
    "common.language": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬â€چط·آ·ط·â€؛ط·آ·ط¢آ©",
    "common.theme": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¸ط·آ¸أ¢â‚¬طŒط·آ·ط¢آ±",

    "navigation.home": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ·ط¢آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ³ط·آ¸ط¸آ¹ط·آ·ط¢آ©",
    "navigation.workspace": "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ",
    "navigation.dashboard": "ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ©",
    "navigation.modules": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط«â€ ط·آ·ط¢آ­ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ·ط¹آ¾",
    "navigation.corporateBrain": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬â€چ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¤ط·آ·ط¢آ³ط·آ·ط¢آ³ط·آ¸ط¸آ¹",
    "navigation.corporateDNA": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ­ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¶ ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ¤ط·آ·ط¢آ³ط·آ·ط¢آ³ط·آ¸ط¸آ¹",
    "navigation.digitalWorkforce": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ¸ط«â€ ط·آ¸أ¢â‚¬آ° ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ¸أ¢â‚¬آ¦ط·آ¸ط¸آ¹ط·آ·ط¢آ©",
    "navigation.commandCenter": "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ±ط·آ¸ط¦â€™ط·آ·ط¢آ² ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ©",

    "workspace.title": "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ¸أ¢â‚¬ع‘ط·آ¸ط¸آ¹ط·آ·ط¢آ§ط·آ·ط¢آ¯ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ¸ط¦â€™ط·آ·ط¢آ©",
    "workspace.label": "ط·آ¸أ¢â‚¬آ¦ط·آ·ط¢آ³ط·آ·ط¢آ§ط·آ·ط¢آ­ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چ",
    "workspace.activeCompany": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ¸ط¦â€™ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ ط·آ·ط¢آ´ط·آ·ط¢آ·ط·آ·ط¢آ©",
    "workspace.companyName": "ط·آ·ط¢آ´ط·آ·ط¢آ±ط·آ¸ط¦â€™ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸ط¸آ¾ط·آ·ط¢آ±ط·آ·ط¢آ§ط·آ·ط¢آ´ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ²ط·آ·ط¢آ±ط·آ¸أ¢â‚¬ع‘ط·آ·ط¢آ§ط·آ·ط·إ’",
    "workspace.companyDetails": "75 ط·آ¸أ¢â‚¬آ¦ط·آ¸ط«â€ ط·آ·ط¢آ¸ط·آ¸ط¸آ¾ط·آ¸أ¢â‚¬آ¹ط·آ·ط¢آ§ ط·آ¢ط¢آ· ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬آ¦ط·آ¸أ¢â‚¬â€چط·آ¸ط¦â€™ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ© ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ³ط·آ·ط¢آ¹ط·آ¸ط«â€ ط·آ·ط¢آ¯ط·آ¸ط¸آ¹ط·آ·ط¢آ©",

    "theme.light": "ط·آ¸ط¸آ¾ط·آ·ط¢آ§ط·آ·ط¹آ¾ط·آ·ط¢آ­",
    "theme.dark": "ط·آ·ط¢آ¯ط·آ·ط¢آ§ط·آ¸ط¦â€™ط·آ¸أ¢â‚¬آ ",
    "theme.system": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ¸أ¢â‚¬آ ط·آ·ط¢آ¸ط·آ·ط¢آ§ط·آ¸أ¢â‚¬آ¦",

    "language.arabic": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ©",
    "language.english": "English",
  },
  en: {
    "brand.name": "KAFU AI",
    "brand.description": "Enterprise AI Operating System",

    "common.active": "Active",
    "common.phase": "Phase 2",
    "common.search": "Search",
    "common.notifications": "Notifications",
    "common.settings": "Settings",
    "common.language": "Language",
    "common.theme": "Theme",

    "navigation.home": "Home",
    "navigation.workspace": "Workspace",
    "navigation.dashboard": "Dashboard",
    "navigation.modules": "Modules",
    "navigation.corporateBrain": "Corporate Brain",
    "navigation.corporateDNA": "Corporate DNA",
    "navigation.digitalWorkforce": "Digital Workforce",
    "navigation.commandCenter": "AI Command Center",

    "workspace.title": "Company Command Workspace",
    "workspace.label": "Workspace",
    "workspace.activeCompany": "Active Company",
    "workspace.companyName": "Blue Butterfly Company",
    "workspace.companyDetails": "75 Employees ط·آ¢ط¢آ· Saudi Arabia",

    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    "language.arabic": "ط·آ·ط¢آ§ط·آ¸أ¢â‚¬â€چط·آ·ط¢آ¹ط·آ·ط¢آ±ط·آ·ط¢آ¨ط·آ¸ط¸آ¹ط·آ·ط¢آ©",
    "language.english": "English",
  },
};

const LocalizationContext =
  createContext<LocalizationContextValue | null>(null);

const LOCALE_STORAGE_KEY = "kafu-ai-locale";

function getStoredLocale(): AppLocale {
  if (typeof window === "undefined") {
    return "ar";
  }

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);

  return storedLocale === "en" ? "en" : "ar";
}

export function LocalizationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocaleState] = useState<AppLocale>("ar");

  const direction: AppDirection = locale === "ar" ? "rtl" : "ltr";

  const applyLocale = useCallback((nextLocale: AppLocale) => {
    const nextDirection = nextLocale === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = nextLocale;
    document.documentElement.dir = nextDirection;
    document.documentElement.dataset.locale = nextLocale;
  }, []);

  useEffect(() => {
    const storedLocale = getStoredLocale();

    const timeoutId = window.setTimeout(() => {
      setLocaleState(storedLocale);
      applyLocale(storedLocale);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [applyLocale]);

  const setLocale = useCallback(
    (nextLocale: AppLocale) => {
      setLocaleState(nextLocale);
      window.localStorage.setItem(LOCALE_STORAGE_KEY, nextLocale);
      applyLocale(nextLocale);
    },
    [applyLocale],
  );

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ar" ? "en" : "ar");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: string) => {
      return translations[locale][key] ?? translations.en[key] ?? key;
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      direction,
      setLocale,
      toggleLocale,
      t,
    }),
    [direction, locale, setLocale, t, toggleLocale],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);

  if (!context) {
    throw new Error(
      "useLocalization must be used inside LocalizationProvider.",
    );
  }

  return context;
}