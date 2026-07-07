import {
  GoToMarketObjective,
  GoToMarketPlan,
} from "./goToMarketTypes";

export function createGoToMarketStrategy(
  name: string,
  objectives: GoToMarketObjective[],
): GoToMarketPlan {
  const timestamp = new Date().toISOString();

  return {
    id: `gtm-${Date.now()}`,
    name,
    stage: "research",
    status: "draft",
    objectives,
    signals: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function advanceGoToMarketStage(
  plan: GoToMarketPlan,
): GoToMarketPlan {
  const stages: GoToMarketPlan["stage"][] = [
    "research",
    "positioning",
    "validation",
    "pre_launch",
    "launch",
    "growth",
    "scale",
  ];

  const currentIndex = stages.indexOf(plan.stage);

  return {
    ...plan,
    stage:
      currentIndex < stages.length - 1
        ? stages[currentIndex + 1]
        : plan.stage,
    updatedAt: new Date().toISOString(),
  };
}