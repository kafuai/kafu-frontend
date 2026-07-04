import {
  PortfolioHealthScore,
  PortfolioInitiative,
} from "./portfolio-management.types";

export interface PortfolioDecisionRecommendation {
  decision: "accelerate" | "rebalance" | "stabilize" | "pause";
  initiativeIds: string[];
  rationale: string;
}

export class PortfolioDecisionRecommender {
  recommend(
    health: PortfolioHealthScore,
    prioritizedInitiatives: PortfolioInitiative[],
  ): PortfolioDecisionRecommendation {
    const topInitiatives = prioritizedInitiatives.slice(0, 3);

    if (health.overallScore >= 80 && health.riskLevel === "low") {
      return {
        decision: "accelerate",
        initiativeIds: topInitiatives.map((initiative) => initiative.id),
        rationale:
          "Portfolio health is strong and risk exposure is low. Accelerate top-value initiatives.",
      };
    }

    if (health.overallScore >= 60) {
      return {
        decision: "rebalance",
        initiativeIds: topInitiatives.map((initiative) => initiative.id),
        rationale:
          "Portfolio is viable but requires allocation rebalancing to improve execution confidence.",
      };
    }

    if (health.overallScore >= 40) {
      return {
        decision: "stabilize",
        initiativeIds: prioritizedInitiatives
          .filter((initiative) => initiative.status === "at_risk")
          .map((initiative) => initiative.id),
        rationale:
          "Portfolio has execution pressure. Stabilize at-risk initiatives before scaling.",
      };
    }

    return {
      decision: "pause",
      initiativeIds: prioritizedInitiatives
        .filter((initiative) => initiative.status === "blocked")
        .map((initiative) => initiative.id),
      rationale:
        "Portfolio health is weak. Pause blocked initiatives and resolve critical constraints.",
    };
  }
}