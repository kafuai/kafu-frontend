export interface BenefitLifecycle {
  benefitId: string;
  stage:
    | "created"
    | "approved"
    | "active"
    | "review"
    | "closed";
}

export function isBenefitLifecycleActive(
  lifecycle: BenefitLifecycle
): boolean {
  return lifecycle.stage === "active";
}
