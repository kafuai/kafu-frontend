import {
  ComplianceMetadata,
  ComplianceOwner,
  ComplianceSeverity,
} from "./complianceTypes";

export type ComplianceFindingStatus =
  | "open"
  | "acknowledged"
  | "in_remediation"
  | "resolved"
  | "accepted_risk";

export interface ComplianceFinding {
  id: string;
  assessmentId: string;
  controlId: string;
  title: string;
  description: string;
  severity: ComplianceSeverity;
  status: ComplianceFindingStatus;
  owner: ComplianceOwner;
  detectedAt: string;
  dueDate?: string;
  metadata: ComplianceMetadata;
}

export function createComplianceFinding(
  finding: ComplianceFinding,
): ComplianceFinding {
  if (!finding.id.trim()) {
    throw new Error("Compliance finding id is required.");
  }

  if (!finding.assessmentId.trim()) {
    throw new Error("Compliance finding assessmentId is required.");
  }

  if (!finding.controlId.trim()) {
    throw new Error("Compliance finding controlId is required.");
  }

  if (!finding.title.trim()) {
    throw new Error("Compliance finding title is required.");
  }

  return {
    ...finding,
    status: finding.status ?? "open",
    metadata: {
      ...finding.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function isFindingOverdue(
  finding: ComplianceFinding,
  asOf: Date = new Date(),
): boolean {
  if (!finding.dueDate || finding.status === "resolved") {
    return false;
  }

  return new Date(finding.dueDate).getTime() < asOf.getTime();
}