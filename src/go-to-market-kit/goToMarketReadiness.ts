export interface GoToMarketReadinessInput {
  targetMarketConfirmed: boolean;
  targetSegmentsConfirmed: boolean;
  valuePropositionApproved: boolean;
  salesAssetsApproved: boolean;
  pilotOfferReady: boolean;
  launchOwnerAssigned: boolean;
}

export interface GoToMarketReadinessResult {
  readyForLaunch: boolean;
  readinessScore: number;
  blockers: string[];
}

export function evaluateGoToMarketReadiness(
  input: GoToMarketReadinessInput,
): GoToMarketReadinessResult {
  const requirements = [
    {
      completed: input.targetMarketConfirmed,
      blocker: "Target market is not confirmed.",
    },
    {
      completed: input.targetSegmentsConfirmed,
      blocker: "Target customer segments are not confirmed.",
    },
    {
      completed: input.valuePropositionApproved,
      blocker: "Value proposition is not approved.",
    },
    {
      completed: input.salesAssetsApproved,
      blocker: "Sales assets are not approved.",
    },
    {
      completed: input.pilotOfferReady,
      blocker: "Pilot offer is not ready.",
    },
    {
      completed: input.launchOwnerAssigned,
      blocker: "Launch owner is not assigned.",
    },
  ];

  const completedCount = requirements.filter(
    (requirement) => requirement.completed,
  ).length;

  const blockers = requirements
    .filter((requirement) => !requirement.completed)
    .map((requirement) => requirement.blocker);

  return {
    readyForLaunch: blockers.length === 0,
    readinessScore: Math.round(
      (completedCount / requirements.length) * 100,
    ),
    blockers,
  };
}
