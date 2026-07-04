import { AIAutonomousStrategyTimeHorizon } from "./aiAutonomousStrategyTypes";
import { AIStrategyPrioritizedInitiative } from "./aiStrategyPrioritizer";

export interface AIStrategyRoadmapSegment {
  horizon: AIAutonomousStrategyTimeHorizon;
  initiatives: AIStrategyPrioritizedInitiative[];
}

export interface AIStrategyRoadmap {
  organizationId: string;
  generatedAt: Date;
  segments: AIStrategyRoadmapSegment[];
}

const horizonOrder: AIAutonomousStrategyTimeHorizon[] = [
  "immediate",
  "short-term",
  "mid-term",
  "long-term",
];

export function createAIStrategyRoadmap(
  organizationId: string,
  initiatives: AIStrategyPrioritizedInitiative[],
): AIStrategyRoadmap {
  const segments = horizonOrder.map((horizon) => ({
    horizon,
    initiatives: initiatives.filter((item) => item.initiative.horizon === horizon),
  }));

  return {
    organizationId,
    generatedAt: new Date(),
    segments,
  };
}