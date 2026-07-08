import type { TreasuryRiskLevel, TreasuryStatus, TreasuryAuditTrail } from "./treasuryManagementTypes";

export interface TreasuryComplianceCheck {
  id: string;
  entityId: string;
  controlName: string;
  controlArea: "banking" | "payments" | "investments" | "debt" | "liquidity" | "reporting";
  passed: boolean;
  findings: string[];
  riskLevel: TreasuryRiskLevel;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export function createTreasuryComplianceCheck(input: {
  id: string;
  entityId: string;
  controlName: string;
  controlArea: TreasuryComplianceCheck["controlArea"];
  passed: boolean;
  findings?: string[];
  riskLevel?: TreasuryRiskLevel;
  createdBy: string;
}): TreasuryComplianceCheck {
  const findings = input.findings ?? [];

  return {
    id: input.id,
    entityId: input.entityId,
    controlName: input.controlName,
    controlArea: input.controlArea,
    passed: input.passed,
    findings,
    riskLevel: input.riskLevel ?? (input.passed ? "low" : "high"),
    status: input.passed ? "approved" : "flagged",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function summarizeTreasuryCompliance(checks: TreasuryComplianceCheck[]): {
  total: number;
  passed: number;
  failed: number;
  flagged: number;
} {
  return {
    total: checks.length,
    passed: checks.filter((check) => check.passed).length,
    failed: checks.filter((check) => !check.passed).length,
    flagged: checks.filter((check) => check.status === "flagged").length,
  };
}
