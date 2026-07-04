import { ExecutiveReasoningContext } from "../types/executiveReasoningTypes";
import { ExecutiveReasoningResult } from "../models/executiveReasoningModel";

export class ExecutiveReasoningValidator {
  validateContext(context: ExecutiveReasoningContext): boolean {
    return Boolean(
      context.organizationId &&
        context.domain &&
        context.objective &&
        context.priority &&
        context.confidence,
    );
  }

  validateResult(result: ExecutiveReasoningResult): boolean {
    return Boolean(
      result.id &&
        result.organizationId &&
        result.objective &&
        result.summary &&
        Array.isArray(result.signals) &&
        result.confidence &&
        result.createdAt,
    );
  }
}