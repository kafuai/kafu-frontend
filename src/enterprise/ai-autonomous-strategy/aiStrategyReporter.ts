import { AIStrategyDecision } from "./aiStrategyDecision";
import { AIStrategyRoadmap } from "./aiStrategyRoadmap";

export interface AIStrategyReport {
  organizationId: string;
  generatedAt: Date;
  roadmapSegments: number;
  initiativeCount: number;
  decision: AIStrategyDecision;
  summary: string;
}

export function createAIStrategyReport(
  roadmap: AIStrategyRoadmap,
  decision: AIStrategyDecision,
): AIStrategyReport {
  const initiativeCount = roadmap.segments.reduce(
    (total, segment) => total + segment.initiatives.length,
    0,
  );

  return {
    organizationId: roadmap.organizationId,
    generatedAt: new Date(),
    roadmapSegments: roadmap.segments.length,
    initiativeCount,
    decision,
    summary: `${initiativeCount} strategic initiatives across ${roadmap.segments.length} roadmap segments. Final decision: ${decision.decision}.`,
  };
}