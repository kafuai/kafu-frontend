"use client";

import { useWebsiteLanguage } from "./LanguageProvider";
import { websiteTranslations } from "./translations";

export default function useWebsiteTranslations() {
  const languageState = useWebsiteLanguage();

  return {
    ...languageState,
    translations: websiteTranslations[languageState.language],
  };
}
