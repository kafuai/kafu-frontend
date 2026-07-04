import {
  ComplianceMetadata,
  ComplianceOwner,
  ComplianceReference,
  ComplianceScope,
} from "./complianceTypes";

export type ComplianceFrameworkCategory =
  | "security"
  | "privacy"
  | "financial"
  | "operational"
  | "legal"
  | "industry"
  | "internal";

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  category: ComplianceFrameworkCategory;
  authority?: string;
  jurisdiction?: string;
  effectiveDate?: string;
  reviewCycleDays?: number;
  owner: ComplianceOwner;
  scope: ComplianceScope;
  references: ComplianceReference[];
  metadata: ComplianceMetadata;
}

export function createComplianceFramework(
  framework: ComplianceFramework,
): ComplianceFramework {
  if (!framework.id.trim()) {
    throw new Error("Compliance framework id is required.");
  }

  if (!framework.name.trim()) {
    throw new Error("Compliance framework name is required.");
  }

  if (!framework.description.trim()) {
    throw new Error("Compliance framework description is required.");
  }

  return {
    ...framework,
    references: framework.references ?? [],
    metadata: {
      ...framework.metadata,
      updatedAt: new Date().toISOString(),
    },
  };
}

export function isFrameworkDueForReview(
  framework: ComplianceFramework,
  asOf: Date = new Date(),
): boolean {
  if (!framework.reviewCycleDays || !framework.metadata.updatedAt) {
    return false;
  }

const updatedAt = new Date(framework.metadata.updatedAt);
  const ageInDays =
    (asOf.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

  return ageInDays >= framework.reviewCycleDays;
}