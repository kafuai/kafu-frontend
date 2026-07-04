import { ExecutiveRecommendationResult } from "../models/executiveRecommendationModel";
import { ExecutiveRecommendationContext } from "../types/executiveRecommendationTypes";

export class ExecutiveRecommendationValidator {
  validateContext(context: ExecutiveRecommendationContext): boolean {
    return Boolean(
      context.organizationId &&
        context.objective &&
        context.decisionTitle &&
        context.decisionRationale &&
        context.priority &&
        context.confidence,
    );
  }

  validateResult(result: ExecutiveRecommendationResult): boolean {
    return Boolean(
      result.id &&
        result.organizationId &&
        result.objective &&
        Array.isArray(result.recommendations) &&
        result.summary &&
        result.confidence &&
        result.createdAt,
    );
  }
}