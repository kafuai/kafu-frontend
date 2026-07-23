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
  /*
   * Keep the server render and the first client render identical.
   * The saved browser preference is restored only after hydration.
   */
  const [language, setLanguageState] =
    useState<WebsiteLanguage>("en");

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    );

    if (isSupportedLanguage(storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  useEffect(() => {
    applyDocumentLanguage(language);
  }, [language]);

  const setLanguage = useCallback((nextLanguage: WebsiteLanguage) => {
    setLanguageState(nextLanguage);
    window.localStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      nextLanguage,
    );
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