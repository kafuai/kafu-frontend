"use client";

import { Languages } from "lucide-react";

import { useLocalization } from "./LocalizationContext";

export default function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useLocalization();

  const nextLanguage =
    locale === "ar"
      ? t("language.english")
      : t("language.arabic");

  return (
    <button
      type="button"
      className="compact-control"
      onClick={toggleLocale}
      aria-label={`${t("common.language")}: ${nextLanguage}`}
      title={`${t("common.language")}: ${nextLanguage}`}
    >
      <Languages size={18} strokeWidth={2} />

      <span className="sr-only">{nextLanguage}</span>
    </button>
  );
}
