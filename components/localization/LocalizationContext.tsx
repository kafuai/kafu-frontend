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
    "brand.name": "كفو للذكاء الاصطناعي",
    "brand.description": "نظام تشغيل ذكي للمؤسسات مدعوم بالذكاء الاصطناعي",

    "common.active": "نشط",
    "common.phase": "المرحلة الثانية",
    "common.search": "بحث",
    "common.notifications": "الإشعارات",
    "common.settings": "الإعدادات",
    "common.language": "اللغة",
    "common.theme": "المظهر",

    "navigation.home": "الرئيسية",
    "navigation.workspace": "مساحة العمل",
    "navigation.dashboard": "لوحة القيادة",
    "navigation.modules": "الوحدات",
    "navigation.corporateBrain": "العقل المؤسسي",
    "navigation.corporateDNA": "الحمض المؤسسي",
    "navigation.digitalWorkforce": "القوى العاملة الرقمية",
    "navigation.commandCenter": "مركز القيادة",
    "navigation.salesIntelligence": "ذكاء المبيعات",
    "workspace.title": "مساحة قيادة الشركة",
    "workspace.label": "مساحة العمل",
    "workspace.activeCompany": "الشركة النشطة",
    "workspace.companyName": "شركة الفراشة الزرقاء",
    "workspace.companyDetails": "75 موظفًا • المملكة العربية السعودية",

    "theme.light": "فاتح",
    "theme.dark": "داكن",
    "theme.system": "النظام",

    "language.arabic": "العربية",
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
    "navigation.salesIntelligence": "Sales Intelligence",
    
    "workspace.title": "Company Command Workspace",
    "workspace.label": "Workspace",
    "workspace.activeCompany": "Active Company",
    "workspace.companyName": "Blue Butterfly Company",
    "workspace.companyDetails": "75 Employees • Saudi Arabia",

    "theme.light": "Light",
    "theme.dark": "Dark",
    "theme.system": "System",

    "language.arabic": "العربية",
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
