import type { TreasuryCurrency, TreasuryRiskLevel, TreasuryStatus, TreasuryAuditTrail } from "./treasuryManagementTypes";

export interface TreasuryDebtFacility {
  id: string;
  entityId: string;
  lenderName: string;
  facilityType: "term_loan" | "revolving_credit" | "overdraft" | "lease" | "bond" | "other";
  principalOutstanding: number;
  interestRatePercent: number;
  currency: TreasuryCurrency;
  maturityDate: string;
  covenantStatus: "compliant" | "watch" | "breach";
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export function createTreasuryDebtFacility(input: {
  id: string;
  entityId: string;
  lenderName: string;
  facilityType: TreasuryDebtFacility["facilityType"];
  principalOutstanding: number;
  interestRatePercent: number;
  currency: TreasuryCurrency;
  maturityDate: string;
  covenantStatus?: TreasuryDebtFacility["covenantStatus"];
  createdBy: string;
}): TreasuryDebtFacility {
  return {
    ...input,
    covenantStatus: input.covenantStatus ?? "compliant",
    status: input.covenantStatus === "breach" ? "flagged" : "active",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function calculateAnnualDebtServiceEstimate(facility: TreasuryDebtFacility): number {
  return facility.principalOutstanding * (facility.interestRatePercent / 100);
}

export function assessTreasuryDebtRisk(facility: TreasuryDebtFacility): TreasuryRiskLevel {
  if (facility.covenantStatus === "breach") return "critical";
  if (facility.covenantStatus === "watch") return "high";
  if (facility.interestRatePercent >= 10) return "medium";
  return "low";
}
