import {
  ComplianceMetadata,
  ComplianceReference,
  ComplianceRequirementType,
  ComplianceSeverity,
} from "./complianceTypes";

export interface ComplianceRequirement {
  id: string;
  frameworkId: string;
  code: string;
  title: string;
  description: string;
  type: ComplianceRequirementType;
  severity: ComplianceSeverity;
  mandatory: boolean;
  references: ComplianceReference[];
  metadata: ComplianceMetadata;
}

export function createComplianceRequirement(
  requirement: ComplianceRequirement,
): ComplianceRequirement {
  if (!requirement.id.trim()) {
    throw new Error("Compliance requirement id is required.");
  }

  if (!requirement.frameworkId.trim()) {
    throw new Error("Compliance requirement frameworkId is required.");
  }

  if (!requirement.code.trim()) {
    throw new Error("Compliance requirement code is required.");
  }

  if (!requirement.title.trim()) {
    throw new Error("Compliance requirement title is required.");
  }

  return {
    ...requirement,
    references: requirement.references ?? [],
    metadata: {
      ...requirement.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function isCriticalRequirement(
  requirement: ComplianceRequirement,
): boolean {
  return requirement.severity === "critical" && requirement.mandatory;
}