import { AIAgentExecution } from "./aiAgentExecution";
import {
  AIAgentExecutionMetrics,
  calculateAIAgentExecutionMetrics,
} from "./aiAgentMetrics";

export interface AIAgentExecutionReport {
  generatedAt: Date;
  metrics: AIAgentExecutionMetrics;
  executions: readonly AIAgentExecution[];
}

export function createAIAgentExecutionReport(
  executions: readonly AIAgentExecution[],
): AIAgentExecutionReport {
  return {
    generatedAt: new Date(),
    metrics: calculateAIAgentExecutionMetrics(executions),
    executions,
  };
}