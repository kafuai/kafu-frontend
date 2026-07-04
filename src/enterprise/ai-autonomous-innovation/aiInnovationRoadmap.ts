import { AIInnovationOpportunity } from "./aiInnovationOpportunity";
import { scoreAIInnovationOpportunity } from "./aiInnovationScoring";

export interface AIInnovationRoadmapPhase {
  name: string;
  objective: string;
  estimatedDurationWeeks: number;
}

export interface AIInnovationRoadmap {
  opportunityId: string;
  phases: AIInnovationRoadmapPhase[];
  generatedAt: Date;
}

export function buildAIInnovationRoadmap(
  opportunity: AIInnovationOpportunity,
): AIInnovationRoadmap {
  const score = scoreAIInnovationOpportunity(opportunity).totalScore;

  const phases: AIInnovationRoadmapPhase[] = [
    {
      name: "Validation",
      objective: "Validate assumptions.",
      estimatedDurationWeeks: 2,
    },
    {
      name: "Experiment",
      objective: "Execute innovation experiment.",
      estimatedDurationWeeks: score >= 0.7 ? 3 : 5,
    },
    {
      name: "Evaluation",
      objective: "Measure outcomes.",
      estimatedDurationWeeks: 2,
    },
    {
      name: "Adoption",
      objective: "Scale across organization.",
      estimatedDurationWeeks: 4,
    },
  ];

  return {
    opportunityId: opportunity.id,
    phases,
    generatedAt: new Date(),
  };
}