import {
  ExplainabilityEvidence,
  ExplainabilityTrace,
} from "./explainabilityTypes";

export class ExplainabilityBuilder {
  buildTrace(
    decisionId: string,
    evidence: ExplainabilityEvidence[],
  ): ExplainabilityTrace {
    return {
      traceId: crypto.randomUUID(),
      decisionId,
      generatedAt: new Date().toISOString(),
      evidence,
    };
  }
}