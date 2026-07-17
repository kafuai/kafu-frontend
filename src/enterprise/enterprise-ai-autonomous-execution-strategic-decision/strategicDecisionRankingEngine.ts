import { StrategicDecision } from "./strategicDecision";
import { StrategicDecisionIntelligenceContext } from "./strategicDecisionContext";
import {
  calculateStrategicDecisionScore,
  StrategicDecisionScore,
} from "./strategicDecisionScoreCalculator";
import {
  assessStrategicDecisionRisk,
  StrategicDecisionRiskAssessment,
} from "./strategicDecisionRiskAssessor";

export interface RankedStrategicDecision {
  rank: number;
  decision: StrategicDecision;
  score: StrategicDecisionScore;
  riskAssessment: StrategicDecisionRiskAssessment;
  executivePriorityScore: number;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function rankStrategicDecisions(
  decisions: StrategicDecision[],
  context: StrategicDecisionIntelligenceContext,
): RankedStrategicDecision[] {
  const rankedDecisions = decisions.map((decision) => {
    const score = calculateStrategicDecisionScore(decision, context);
    const riskAssessment = assessStrategicDecisionRisk(decision, context);

    const riskPenalty =
      riskAssessment.riskLevel === "critical"
        ? 25
        : riskAssessment.riskLevel === "high"
          ? 15
          : riskAssessment.riskLevel === "moderate"
            ? 7
            : 0;

    const executivePriorityScore = clampScore(
      score.totalScore -
        riskPenalty +
        score.urgencyScore * 0.1 +
        score.strategicAlignmentScore * 0.1,
    );

    return {
      rank: 0,
      decision,
      score,
      riskAssessment,
      executivePriorityScore,
    };
  });

  return rankedDecisions
    .sort((first, second) => {
      if (
        second.executivePriorityScore !== first.executivePriorityScore
      ) {
        return (
          second.executivePriorityScore - first.executivePriorityScore
        );
      }

      if (second.score.totalScore !== first.score.totalScore) {
        return second.score.totalScore - first.score.totalScore;
      }

      return first.decision.createdAt.localeCompare(
        second.decision.createdAt,
      );
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));
}

export function selectTopStrategicDecision(
  decisions: StrategicDecision[],
  context: StrategicDecisionIntelligenceContext,
): RankedStrategicDecision | null {
  return rankStrategicDecisions(decisions, context)[0] ?? null;
}
