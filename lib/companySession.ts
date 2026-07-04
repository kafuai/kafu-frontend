export const KAFU_COMPANY_ID_KEY = "kafu_company_id";

export function saveCurrentCompanyId(companyId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KAFU_COMPANY_ID_KEY, companyId);
}

export function getCurrentCompanyId() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KAFU_COMPANY_ID_KEY);
}

export function clearCurrentCompanyId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KAFU_COMPANY_ID_KEY);
}