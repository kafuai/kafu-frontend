import { GoToMarketPlan } from "./goToMarketTypes";

export interface GoToMarketRoadmapItem {
  title: string;
  stage: GoToMarketPlan["stage"];
  completed: boolean;
}

export function buildGoToMarketRoadmap(
  plan: GoToMarketPlan,
): GoToMarketRoadmapItem[] {
  return [
    {
      title: "Market Research",
      stage: "research",
      completed: plan.stage !== "research",
    },
    {
      title: "Product Positioning",
      stage: "positioning",
      completed: [
        "validation",
        "pre_launch",
        "launch",
        "growth",
        "scale",
      ].includes(plan.stage),
    },
    {
      title: "Market Validation",
      stage: "validation",
      completed: [
        "pre_launch",
        "launch",
        "growth",
        "scale",
      ].includes(plan.stage),
    },
    {
      title: "Launch",
      stage: "launch",
      completed: ["growth", "scale"].includes(plan.stage),
    },
    {
      title: "Growth & Scale",
      stage: "scale",
      completed: plan.stage === "scale",
    },
  ];
}