import { MarketingConsentStatus } from "./marketingAutomationTypes";

export type MarketingConsentRecord = {
  contactId: string;
  status: MarketingConsentStatus;
  updatedAt: string;
};

export function hasMarketingConsent(
  record: MarketingConsentRecord,
): boolean {
  return record.status === "opted_in";
}

export function revokeMarketingConsent(
  record: MarketingConsentRecord,
): MarketingConsentRecord {
  return {
    ...record,
    status: "opted_out",
    updatedAt: new Date().toISOString(),
  };
}
