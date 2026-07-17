import type {
  FinalProductValidationEvidence,
  FinalProductValidationRequirement,
} from "./finalProductValidationTypes";
import { FINAL_PRODUCT_VALIDATION_CHECKLIST } from "./finalProductValidationChecklist";

export interface FinalProductValidationContextInput {
  productName: string;
  version: string;
  evidence?: FinalProductValidationEvidence[];
  evaluatedAt?: string;
}

export interface FinalProductValidationContext {
  productName: string;
  version: string;
  evaluatedAt: string;
  requirements: readonly FinalProductValidationRequirement[];
  evidenceByRequirementId: ReadonlyMap<
    string,
    FinalProductValidationEvidence
  >;
}

export function createFinalProductValidationContext(
  input: FinalProductValidationContextInput,
): FinalProductValidationContext {
  const evidenceByRequirementId = new Map<
    string,
    FinalProductValidationEvidence
  >();

  for (const evidence of input.evidence ?? []) {
    evidenceByRequirementId.set(evidence.requirementId, evidence);
  }

  return {
    productName: input.productName.trim(),
    version: input.version.trim(),
    evaluatedAt: input.evaluatedAt ?? new Date().toISOString(),
    requirements: FINAL_PRODUCT_VALIDATION_CHECKLIST,
    evidenceByRequirementId,
  };
}
