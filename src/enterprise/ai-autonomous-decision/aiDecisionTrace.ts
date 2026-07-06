export interface AIDecisionTraceStep {
  id: string;
  label: string;
  description: string;
  completedAt: Date;
}

export interface AIDecisionTrace {
  decisionId: string;
  steps: AIDecisionTraceStep[];
  createdAt: Date;
}

export function createAIDecisionTrace(input: {
  decisionId: string;
  steps: Omit<AIDecisionTraceStep, "completedAt">[];
}): AIDecisionTrace {
  return {
    decisionId: input.decisionId,
    steps: input.steps.map((step) => ({
      ...step,
      completedAt: new Date(),
    })),
    createdAt: new Date(),
  };
}