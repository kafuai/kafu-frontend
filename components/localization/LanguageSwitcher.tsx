"use client";

import { Languages } from "lucide-react";

import { useLocalization } from "./LocalizationContext";

export default function LanguageSwitcher() {
  const { locale, toggleLocale, t } = useLocalization();

  return (
    <button
      type="button"
      className="language-switcher"
      onClick={toggleLocale}
      aria-label={t("common.language")}
      title={t("common.language")}
    >
      <Languages size={17} strokeWidth={2} />

      <span>
        {locale === "ar"
          ? t("language.english")
          : t("language.arabic")}
      </span>
    </button>
  );
}