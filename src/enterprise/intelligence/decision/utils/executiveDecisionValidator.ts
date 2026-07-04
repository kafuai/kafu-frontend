import { ExecutiveDecisionContext } from "../types/executiveDecisionTypes";
import { ExecutiveDecisionResult } from "../models/executiveDecisionModel";

export class ExecutiveDecisionValidator {
  validateContext(context: ExecutiveDecisionContext): boolean {
    return Boolean(
      context.organizationId &&
        context.objective &&
        context.priority &&
        context.confidence &&
        context.reasoningSummary &&
        Array.isArray(context.signals),
    );
  }

  validateResult(result: ExecutiveDecisionResult): boolean {
    return Boolean(
      result.id &&
        result.organizationId &&
        result.objective &&
        result.recommendedOption &&
        Array.isArray(result.alternatives) &&
        result.rationale &&
        result.confidence &&
        result.createdAt,
    );
  }
}