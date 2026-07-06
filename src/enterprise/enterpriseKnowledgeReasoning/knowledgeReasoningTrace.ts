export interface KnowledgeReasoningTraceStep {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly inputIds: readonly string[];
  readonly outputIds: readonly string[];
  readonly createdAt: string;
}

export interface KnowledgeReasoningTrace {
  readonly id: string;
  readonly conclusionId: string;
  readonly steps: readonly KnowledgeReasoningTraceStep[];
  readonly createdAt: string;
}

export function createKnowledgeReasoningTrace(
  trace: KnowledgeReasoningTrace,
): KnowledgeReasoningTrace {
  return {
    ...trace,
    steps: trace.steps.map((step) => ({
      ...step,
      inputIds: [...step.inputIds],
      outputIds: [...step.outputIds],
    })),
  };
}