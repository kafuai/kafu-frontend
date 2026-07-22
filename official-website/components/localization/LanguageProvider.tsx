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

export type WebsiteLanguage = "en" | "ar";
export type WebsiteDirection = "ltr" | "rtl";

type LanguageContextValue = {
  language: WebsiteLanguage;
  direction: WebsiteDirection;
  isArabic: boolean;
  setLanguage: (language: WebsiteLanguage) => void;
  toggleLanguage: () => void;
};

const LANGUAGE_STORAGE_KEY = "kafu-ai-website-language";

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isSupportedLanguage(value: string | null): value is WebsiteLanguage {
  return value === "en" || value === "ar";
}

function getInitialLanguage(): WebsiteLanguage {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return isSupportedLanguage(storedLanguage) ? storedLanguage : "en";
}

function applyDocumentLanguage(language: WebsiteLanguage) {
  const direction: WebsiteDirection = language === "ar" ? "rtl" : "ltr";

  document.documentElement.lang = language;
  document.documentElement.dir = direction;
  document.documentElement.dataset.language = language;
  document.body.dir = direction;
}

export default function LanguageProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [language, setLanguageState] =
    useState<WebsiteLanguage>(getInitialLanguage);

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: WebsiteLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "ar" : "en");
  }, [language, setLanguage]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction: language === "ar" ? "rtl" : "ltr",
      isArabic: language === "ar",
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useWebsiteLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useWebsiteLanguage must be used inside LanguageProvider.",
    );
  }

  return context;
}
