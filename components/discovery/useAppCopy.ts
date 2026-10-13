import { CONTENT } from "./types";

export function useAppCopy(isArabic: boolean) {
  const t = isArabic ? CONTENT.ar : CONTENT.en;
  return { t };
}