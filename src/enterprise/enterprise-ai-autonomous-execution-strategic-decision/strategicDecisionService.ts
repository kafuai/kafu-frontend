import { StrategicDecision } from "./strategicDecision";
import { StrategicDecisionIntelligenceContext } from "./strategicDecisionContext";
import {
  rankStrategicDecisions,
  RankedStrategicDecision,
} from "./strategicDecisionRankingEngine";
import { buildStrategicDecisionRecommendation } from "./strategicDecisionRecommendationEngine";
import {
  buildStrategicDecisionNarrative,
  StrategicDecisionNarrative,
} from "./strategicDecisionNarrativeBuilder";
import {
  StrategicDecisionRecommendation,
  StrategicDecisionResult,
} from "./strategicDecisionResult";

export interface StrategicDecisionAnalysis {
  result: StrategicDecisionResult;
  narrative: StrategicDecisionNarrative;
}

export interface StrategicDecisionPortfolioResult {
  organizationId: string;
  generatedAt: string;
  totalDecisions: number;
  rankedDecisions: RankedStrategicDecision[];
  recommendedDecision: StrategicDecisionAnalysis | null;
}

export class StrategicDecisionService {
  analyzeDecision(
    decision: StrategicDecision,
    context: StrategicDecisionIntelligenceContext,
  ): StrategicDecisionAnalysis {
    const rankedDecision = rankStrategicDecisions(
      [decision],
      context,
    )[0];

    if (!rankedDecision) {
      throw new Error(
        `Unable to analyze strategic decision ${decision.decisionId}.`,
      );
    }

    const recommendation =
      buildStrategicDecisionRecommendation(rankedDecision);

    return this.buildAnalysis(
      rankedDecision,
      recommendation,
      context.organization.organizationId,
    );
  }

  analyzePortfolio(
    decisions: StrategicDecision[],
    context: StrategicDecisionIntelligenceContext,
  ): StrategicDecisionPortfolioResult {
    const rankedDecisions = rankStrategicDecisions(
      decisions,
      context,
    );

    const topDecision = rankedDecisions[0] ?? null;

    const recommendedDecision = topDecision
      ? this.buildAnalysis(
          topDecision,
          buildStrategicDecisionRecommendation(topDecision),
          context.organization.organizationId,
        )
      : null;

    return {
      organizationId: context.organization.organizationId,
      generatedAt: new Date().toISOString(),
      totalDecisions: decisions.length,
      rankedDecisions,
      recommendedDecision,
    };
  }

  private buildAnalysis(
    rankedDecision: RankedStrategicDecision,
    recommendation: StrategicDecisionRecommendation,
    organizationId: string,
  ): StrategicDecisionAnalysis {
    const generatedAt = new Date().toISOString();

    const result: StrategicDecisionResult = {
      generatedAt,
      organizationId,
      rankedDecision,
      score: rankedDecision.score,
      riskAssessment: rankedDecision.riskAssessment,
      recommendation,
    };

    const narrative = buildStrategicDecisionNarrative(
      rankedDecision,
      recommendation,
    );

    return {
      result,
      narrative,
    };
  }
}
