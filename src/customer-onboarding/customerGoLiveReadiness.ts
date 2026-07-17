export interface CustomerGoLiveReadinessInput {
  onboardingCompleted: boolean;
  activationCompleted: boolean;
  customerApprovalReceived: boolean;
  productionConfigurationValidated: boolean;
  supportCoverageConfirmed: boolean;
  rollbackPlanConfirmed: boolean;
}

export interface CustomerGoLiveReadinessResult {
  readyForGoLive: boolean;
  readinessScore: number;
  blockers: string[];
}

export function evaluateCustomerGoLiveReadiness(
  input: CustomerGoLiveReadinessInput,
): CustomerGoLiveReadinessResult {
  const requirements = [
    {
      completed: input.onboardingCompleted,
      blocker: "Customer onboarding is incomplete.",
    },
    {
      completed: input.activationCompleted,
      blocker: "Customer activation is incomplete.",
    },
    {
      completed: input.customerApprovalReceived,
      blocker: "Customer go-live approval has not been received.",
    },
    {
      completed: input.productionConfigurationValidated,
      blocker: "Production configuration has not been validated.",
    },
    {
      completed: input.supportCoverageConfirmed,
      blocker: "Go-live support coverage has not been confirmed.",
    },
    {
      completed: input.rollbackPlanConfirmed,
      blocker: "Rollback plan has not been confirmed.",
    },
  ];

  const completedCount = requirements.filter(
    (requirement) => requirement.completed,
  ).length;

  const blockers = requirements
    .filter((requirement) => !requirement.completed)
    .map((requirement) => requirement.blocker);

  return {
    readyForGoLive: blockers.length === 0,
    readinessScore: Math.round(
      (completedCount / requirements.length) * 100,
    ),
    blockers,
  };
}
