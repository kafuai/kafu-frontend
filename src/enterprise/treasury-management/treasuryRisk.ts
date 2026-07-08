import type { TreasuryRiskLevel, TreasuryStatus, TreasuryAuditTrail } from "./treasuryManagementTypes";

export interface TreasuryRiskExposure {
  id: string;
  entityId: string;
  riskType: "liquidity" | "fx" | "interest_rate" | "counterparty" | "credit" | "operational";
  exposureAmount: number;
  mitigationPlan?: string;
  riskLevel: TreasuryRiskLevel;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export function createTreasuryRiskExposure(input: {
  id: string;
  entityId: string;
  riskType: TreasuryRiskExposure["riskType"];
  exposureAmount: number;
  mitigationPlan?: string;
  riskLevel: TreasuryRiskLevel;
  createdBy: string;
}): TreasuryRiskExposure {
  return {
    ...input,
    status: input.riskLevel === "critical" || input.riskLevel === "high" ? "flagged" : "active",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function escalateTreasuryRiskExposure(
  exposure: TreasuryRiskExposure,
  updatedBy: string
): TreasuryRiskExposure {
  return {
    ...exposure,
    status: "under_review",
    audit: {
      ...exposure.audit,
      updatedBy,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function requiresTreasuryRiskCommittee(exposure: TreasuryRiskExposure): boolean {
  return exposure.riskLevel === "high" || exposure.riskLevel === "critical";
}
