import { AIExecutionKnowledgeRecord } from "./aiExecutionKnowledgeRecord";

export interface AIExecutionKnowledgeSynthesis {
  totalRecords: number;
  averageConfidence: number;
  averageReusability: number;
  topTags: string[];
  recommendations: string[];
}

export function synthesizeAIExecutionKnowledge(
  records: AIExecutionKnowledgeRecord[],
): AIExecutionKnowledgeSynthesis {
  if (records.length === 0) {
    return {
      totalRecords: 0,
      averageConfidence: 0,
      averageReusability: 0,
      topTags: [],
      recommendations: [],
    };
  }

  const tagCounts = new Map<string, number>();

  let confidence = 0;
  let reusability = 0;

  for (const record of records) {
    confidence += record.metrics.confidence;
    reusability += record.metrics.reusability;

    for (const tag of record.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  const topTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([tag]) => tag);

  const recommendations = records
    .flatMap((record) => record.recommendations)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 10)
    .map((recommendation) => recommendation.action);

  return {
    totalRecords: records.length,
    averageConfidence: confidence / records.length,
    averageReusability: reusability / records.length,
    topTags,
    recommendations,
  };
}