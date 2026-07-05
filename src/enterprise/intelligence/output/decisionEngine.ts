import { AIDecision, AIAction } from "./decisionTypes";
import { UnifiedInsight } from "../fusion/fusion.types";

export class DecisionEngine {
  decide(insight: UnifiedInsight): AIDecision {
    const actions: AIAction[] = [];

    // 🔥 rule-based decision logic
    if (insight.riskLevel === "high") {
      actions.push({
        id: `action-${Date.now()}`,
        type: "notify",
        payload: {
          message: "High risk detected",
        },
        createdAt: Date.now(),
      });
    }

    if (insight.riskLevel === "medium") {
      actions.push({
        id: `action-${Date.now()}`,
        type: "recommend",
        payload: {
          message: "Review required",
        },
        createdAt: Date.now(),
      });
    }

    return {
      id: `decision-${Date.now()}`,
      organizationId: insight.organizationId,
      insight,
      decision: insight.summary,
      confidence: insight.confidence,
      actions,
      createdAt: Date.now(),
    };
  }
}