import { AIReasoningMetadata } from "./aiReasoningTypes";

export interface AIReasoningProblem {
  readonly id: string;
  readonly title: string;
  readonly description: string;

  readonly category: string;
  readonly domain: string;

  readonly objectives: readonly string[];
  readonly constraints: readonly string[];

  readonly assumptions: readonly string[];

  readonly metadata: AIReasoningMetadata;
}

export function createAIReasoningProblem(
  input: AIReasoningProblem,
): AIReasoningProblem {
  return Object.freeze({
    ...input,
    objectives: [...input.objectives],
    constraints: [...input.constraints],
    assumptions: [...input.assumptions],
  });
}