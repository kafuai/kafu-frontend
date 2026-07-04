export type ExplainabilityEvidence = {
  sourceId: string;
  sourceType: string;
  summary: string;
  confidence: number;
};

export type ExplainabilityTrace = {
  traceId: string;
  decisionId: string;
  generatedAt: string;
  evidence: ExplainabilityEvidence[];
};