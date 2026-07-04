import { AIExecutionKnowledgeRepository } from "./aiExecutionKnowledgeRepository";

export interface AIExecutionKnowledgeReport {
  generatedAt: Date;
  totalRecords: number;
  activeRecords: number;
  trustedRecords: number;
  averageConfidence: number;
}

export function generateAIExecutionKnowledgeReport(
  repository: AIExecutionKnowledgeRepository,
): AIExecutionKnowledgeReport {
  const records = repository.list();

  const totalRecords = records.length;

  const activeRecords = records.filter(
    (record) => record.status === "active",
  ).length;

  const trustedRecords = records.filter(
    (record) => record.reliability === "trusted",
  ).length;

  const averageConfidence =
    totalRecords === 0
      ? 0
      : records.reduce(
          (sum, record) => sum + record.metrics.confidence,
          0,
        ) / totalRecords;

  return {
    generatedAt: new Date(),
    totalRecords,
    activeRecords,
    trustedRecords,
    averageConfidence,
  };
}