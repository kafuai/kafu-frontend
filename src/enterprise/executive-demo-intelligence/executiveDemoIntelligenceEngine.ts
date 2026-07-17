import {
  calculateExecutiveDemoIntelligenceConfidence,
} from "./executiveDemoIntelligenceConfidence";
import {
  buildInsightsFromExecutiveDemoSignals,
  rankExecutiveDemoIntelligenceInsights,
} from "./executiveDemoIntelligenceInsightBuilder";
import {
  buildExecutiveDemoIntelligenceRecommendation,
  formatExecutiveDemoPrimaryRecommendation,
} from "./executiveDemoIntelligenceRecommendation";
import {
  buildExecutiveDemoIntelligenceSummary,
} from "./executiveDemoIntelligenceSummary";
import type {
  ExecutiveDemoIntelligenceInput,
  ExecutiveDemoIntelligenceResult,
} from "./executiveDemoIntelligenceTypes";
import {
  validateExecutiveDemoIntelligenceInput,
} from "./executiveDemoIntelligenceValidator";

export class ExecutiveDemoIntelligenceEngine {
  generate(
    input: ExecutiveDemoIntelligenceInput,
  ): ExecutiveDemoIntelligenceResult {
    const validation =
      validateExecutiveDemoIntelligenceInput(input);

    if (!validation.valid) {
      throw new Error(
        `Invalid executive demo intelligence input: ${validation.errors.join(" ")}`,
      );
    }

    const signals = input.signals ?? [];

    const confidenceResult =
      calculateExecutiveDemoIntelligenceConfidence(input);

    const insights = rankExecutiveDemoIntelligenceInsights(
      buildInsightsFromExecutiveDemoSignals(
        signals,
        confidenceResult.confidence,
      ),
    );

    const recommendation =
      buildExecutiveDemoIntelligenceRecommendation(
        input.context,
        insights,
        signals,
      );

    const executiveSummary =
      buildExecutiveDemoIntelligenceSummary({
        context: input.context,
        insights,
        signals,
        confidence: confidenceResult.confidence,
      });

    return {
      sessionId: input.context.sessionId,
      organizationId: input.context.organizationId,
      executiveSummary,
      insights,
      primaryRecommendation:
        formatExecutiveDemoPrimaryRecommendation(recommendation),
      confidence: confidenceResult.confidence,
      generatedAt: new Date().toISOString(),
    };
  }
}
