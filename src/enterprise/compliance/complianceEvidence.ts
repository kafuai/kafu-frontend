import { ComplianceMetadata, ComplianceOwner } from "./complianceTypes";

export type ComplianceEvidenceType =
  | "document"
  | "system_log"
  | "screenshot"
  | "attestation"
  | "audit_record"
  | "configuration"
  | "metric"
  | "external_report";

export interface ComplianceEvidence {
  id: string;
  controlId: string;
  title: string;
  description: string;
  type: ComplianceEvidenceType;
  source: string;
  collectedAt: string;
  collectedBy: ComplianceOwner;
  validUntil?: string;
  immutable: boolean;
  uri?: string;
  metadata: ComplianceMetadata;
}

export function createComplianceEvidence(
  evidence: ComplianceEvidence,
): ComplianceEvidence {
  if (!evidence.id.trim()) {
    throw new Error("Compliance evidence id is required.");
  }

  if (!evidence.controlId.trim()) {
    throw new Error("Compliance evidence controlId is required.");
  }

  if (!evidence.title.trim()) {
    throw new Error("Compliance evidence title is required.");
  }

  if (!evidence.source.trim()) {
    throw new Error("Compliance evidence source is required.");
  }

  return {
    ...evidence,
    metadata: {
      ...evidence.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function isEvidenceExpired(
  evidence: ComplianceEvidence,
  asOf: Date = new Date(),
): boolean {
  if (!evidence.validUntil) {
    return false;
  }

  return new Date(evidence.validUntil).getTime() < asOf.getTime();
}