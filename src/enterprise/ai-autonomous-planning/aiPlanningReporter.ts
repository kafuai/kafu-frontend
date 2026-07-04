import { AIPlanningConstraint } from "./aiPlanningConstraint";
import { AIPlanningObjective } from "./aiPlanningObjective";
import { AIPlanningOption } from "./aiPlanningOption";
import { AIPlanningRoadmap } from "./aiPlanningRoadmap";
import { AIPlanningScore } from "./aiPlanningScoring";

export interface AIPlanningExecutiveReport {
  organizationId: string;
  objectiveId: string;
  objectiveTitle: string;
  selectedOptionId: string;
  selectedOptionName: string;
  roadmapId: string;
  roadmapTitle: string;
  roadmapPhaseCount: number;
  estimatedDurationDays: number;
  estimatedCost: number;
  expectedValue: number;
  planningScore: number;
  confidence: string;
  blockingConstraints: number;
  generatedAt: Date;
}

export interface CreateAIPlanningExecutiveReportInput {
  objective: AIPlanningObjective;
  selectedOption: AIPlanningOption;
  roadmap: AIPlanningRoadmap;
  score: AIPlanningScore;
  constraints: AIPlanningConstraint[];
  generatedAt?: Date;
}

export function createAIPlanningExecutiveReport(
  input: CreateAIPlanningExecutiveReportInput,
): AIPlanningExecutiveReport {
  const blockingConstraints = input.constraints.filter(
    (constraint) => constraint.isBlocking,
  ).length;

  return {
    organizationId: input.objective.organizationId,
    objectiveId: input.objective.id,
    objectiveTitle: input.objective.title,
    selectedOptionId: input.selectedOption.id,
    selectedOptionName: input.selectedOption.name,
    roadmapId: input.roadmap.id,
    roadmapTitle: input.roadmap.title,
    roadmapPhaseCount: input.roadmap.phases.length,
    estimatedDurationDays: input.roadmap.totalDurationDays,
    estimatedCost: input.selectedOption.estimatedCost,
    expectedValue: input.selectedOption.expectedValue,
    planningScore: input.score.totalScore,
    confidence: input.selectedOption.confidence,
    blockingConstraints,
    generatedAt: input.generatedAt ?? new Date(),
  };
}

export function formatAIPlanningExecutiveSummary(
  report: AIPlanningExecutiveReport,
): string {
  return [
    `Planning Objective: ${report.objectiveTitle}`,
    `Selected Option: ${report.selectedOptionName}`,
    `Planning Score: ${report.planningScore.toFixed(2)}`,
    `Estimated Duration: ${report.estimatedDurationDays} days`,
    `Estimated Cost: ${report.estimatedCost}`,
    `Expected Value: ${report.expectedValue}`,
    `Roadmap Phases: ${report.roadmapPhaseCount}`,
    `Confidence: ${report.confidence}`,
    `Blocking Constraints: ${report.blockingConstraints}`,
  ].join("\n");
}