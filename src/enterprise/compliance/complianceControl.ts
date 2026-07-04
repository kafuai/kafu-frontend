import {
  ComplianceControlType,
  ComplianceMetadata,
  ComplianceOwner,
  ComplianceSeverity,
} from "./complianceTypes";

export interface ComplianceControl {
  id: string;
  requirementId: string;
  name: string;
  description: string;
  type: ComplianceControlType;
  severity: ComplianceSeverity;
  owner: ComplianceOwner;
  automated: boolean;
  evidenceRequired: boolean;
  testProcedure?: string;
  metadata: ComplianceMetadata;
}

export function createComplianceControl(
  control: ComplianceControl,
): ComplianceControl {
  if (!control.id.trim()) {
    throw new Error("Compliance control id is required.");
  }

  if (!control.requirementId.trim()) {
    throw new Error("Compliance control requirementId is required.");
  }

  if (!control.name.trim()) {
    throw new Error("Compliance control name is required.");
  }

  if (!control.description.trim()) {
    throw new Error("Compliance control description is required.");
  }

  return {
    ...control,
    metadata: {
      ...control.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function requiresManualEvidence(
  control: ComplianceControl,
): boolean {
  return control.evidenceRequired && !control.automated;
}