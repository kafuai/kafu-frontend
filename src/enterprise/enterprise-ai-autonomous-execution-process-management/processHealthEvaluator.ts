import {
  EnterpriseAIProcess,
  EnterpriseAIProcessHealth,
} from "./process.types";
import {
  EnterpriseAIProcessHealthState,
  EnterpriseAIProcessRiskLevel,
} from "./process.enums";

export class EnterpriseAIProcessHealthEvaluator {
  evaluate(process: EnterpriseAIProcess): EnterpriseAIProcessHealth {
    const reasons: string[] = [];
    let score = 100;

    if (process.metrics.failureRate > 0.20) {
      score -= 40;
      reasons.push("High failure rate.");
    }

    if (process.metrics.blockedCount > 0) {
      score -= 20;
      reasons.push("Blocked dependencies detected.");
    }

    if (process.dependencies.length > 10) {
      score -= 10;
      reasons.push("Large dependency graph.");
    }

    score = Math.max(0, score);

    const state =
      score >= 90
        ? EnterpriseAIProcessHealthState.HEALTHY
        : score >= 70
          ? EnterpriseAIProcessHealthState.DEGRADED
          : score >= 40
            ? EnterpriseAIProcessHealthState.AT_RISK
            : EnterpriseAIProcessHealthState.CRITICAL;

    const riskLevel =
      score >= 90
        ? EnterpriseAIProcessRiskLevel.LOW
        : score >= 70
          ? EnterpriseAIProcessRiskLevel.MODERATE
          : score >= 40
            ? EnterpriseAIProcessRiskLevel.HIGH
            : EnterpriseAIProcessRiskLevel.CRITICAL;

    return {
      state,
      riskLevel,
      score,
      reasons,
    };
  }
}