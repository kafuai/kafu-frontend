import {
  StrategicObjective,
  StrategicPlanningAssessment,
  StrategicPlanningContext,
} from "./strategicPlanning.types";
import { StrategicScenarioPlan } from "./strategicScenarioPlanner";

export type StrategicRoadmapPhaseType =
  | "foundation"
  | "acceleration"
  | "optimization"
  | "scale";

export interface StrategicRoadmapMilestone {
  id: string;
  objectiveId: string;
  title: string;
  successCriteria: string[];
  riskControls: string[];
  dependencyNotes: string[];
}

export interface StrategicRoadmapPhase {
  id: string;
  type: StrategicRoadmapPhaseType;
  title: string;
  objectiveIds: string[];
  milestones: StrategicRoadmapMilestone[];
  leadershipFocus: string;
}

export interface StrategicRoadmap {
  organizationId: string;
  planningHorizon: StrategicPlanningContext["planningHorizon"];
  phases: StrategicRoadmapPhase[];
  strategicReadinessScore: number;
  executiveGuidance: string;
  generatedAt: string;
}

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));

const averageScore = (values: number[]): number => {
  if (values.length === 0) return 0;

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
};

export class StrategicRoadmapEngine {
  buildRoadmap(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
    scenarioPlan: StrategicScenarioPlan,
  ): StrategicRoadmap {
    const preferredObjectiveIds = new Set(
      scenarioPlan.scenarios.find(
        (scenario) => scenario.id === scenarioPlan.preferredScenarioId,
      )?.objectiveIds ?? context.strategicObjectives.map((objective) => objective.id),
    );

    const selectedObjectives = context.strategicObjectives.filter((objective) =>
      preferredObjectiveIds.has(objective.id),
    );

    const phases = [
      this.buildFoundationPhase(selectedObjectives, assessments),
      this.buildAccelerationPhase(selectedObjectives, assessments),
      this.buildOptimizationPhase(selectedObjectives, assessments),
      this.buildScalePhase(selectedObjectives, assessments),
    ].filter((phase) => phase.objectiveIds.length > 0);

    const strategicReadinessScore = this.calculateReadinessScore(assessments);

    return {
      organizationId: context.organizationId,
      planningHorizon: context.planningHorizon,
      phases,
      strategicReadinessScore,
      executiveGuidance: this.buildExecutiveGuidance(strategicReadinessScore, phases.length),
      generatedAt: new Date().toISOString(),
    };
  }

  private buildFoundationPhase(
    objectives: StrategicObjective[],
    assessments: StrategicPlanningAssessment[],
  ): StrategicRoadmapPhase {
    const objectiveIds = this.filterObjectiveIds(
      objectives,
      assessments,
      (assessment) =>
        assessment.dependencyComplexityScore >= 65 || assessment.riskExposureScore >= 65,
    );

    return {
      id: "phase-foundation",
      type: "foundation",
      title: "Strategic Foundation and Risk Alignment",
      objectiveIds,
      milestones: this.buildMilestones(objectives, objectiveIds, "foundation"),
      leadershipFocus:
        "Align executive ownership, reduce major risks, and clarify dependencies before acceleration.",
    };
  }

  private buildAccelerationPhase(
    objectives: StrategicObjective[],
    assessments: StrategicPlanningAssessment[],
  ): StrategicRoadmapPhase {
    const objectiveIds = this.filterObjectiveIds(
      objectives,
      assessments,
      (assessment) =>
        assessment.impactScore >= 75 &&
        assessment.feasibilityScore >= 65 &&
        assessment.riskExposureScore < 70,
    );

    return {
      id: "phase-acceleration",
      type: "acceleration",
      title: "High-Impact Strategic Acceleration",
      objectiveIds,
      milestones: this.buildMilestones(objectives, objectiveIds, "acceleration"),
      leadershipFocus:
        "Move validated high-impact initiatives into focused execution with measurable outcomes.",
    };
  }

  private buildOptimizationPhase(
    objectives: StrategicObjective[],
    assessments: StrategicPlanningAssessment[],
  ): StrategicRoadmapPhase {
    const objectiveIds = this.filterObjectiveIds(
      objectives,
      assessments,
      (assessment) =>
        assessment.feasibilityScore >= 60 &&
        assessment.dependencyComplexityScore < 70,
    );

    return {
      id: "phase-optimization",
      type: "optimization",
      title: "Strategic Execution Optimization",
      objectiveIds,
      milestones: this.buildMilestones(objectives, objectiveIds, "optimization"),
      leadershipFocus:
        "Improve execution efficiency, remove friction, and strengthen operating cadence.",
    };
  }

  private buildScalePhase(
    objectives: StrategicObjective[],
    assessments: StrategicPlanningAssessment[],
  ): StrategicRoadmapPhase {
    const objectiveIds = this.filterObjectiveIds(
      objectives,
      assessments,
      (assessment) =>
        assessment.impactScore >= 80 &&
        assessment.confidence !== "low" &&
        assessment.riskExposureScore < 75,
    );

    return {
      id: "phase-scale",
      type: "scale",
      title: "Enterprise Strategic Scaling",
      objectiveIds,
      milestones: this.buildMilestones(objectives, objectiveIds, "scale"),
      leadershipFocus:
        "Scale strategic capabilities across the enterprise once readiness and confidence are proven.",
    };
  }

  private buildMilestones(
    objectives: StrategicObjective[],
    objectiveIds: string[],
    phaseType: StrategicRoadmapPhaseType,
  ): StrategicRoadmapMilestone[] {
    return objectives
      .filter((objective) => objectiveIds.includes(objective.id))
      .map((objective) => ({
        id: `${phaseType}-${objective.id}`,
        objectiveId: objective.id,
        title: `${objective.title} ${this.phaseLabel(phaseType)}`,
        successCriteria: objective.successMetrics,
        riskControls:
          objective.risks.length > 0
            ? objective.risks.map((risk) => `Control risk: ${risk}`)
            : ["Maintain active strategic risk monitoring."],
        dependencyNotes:
          objective.dependencies.length > 0
            ? objective.dependencies.map((dependency) => `Coordinate dependency: ${dependency}`)
            : ["No major dependencies identified."],
      }));
  }

  private filterObjectiveIds(
    objectives: StrategicObjective[],
    assessments: StrategicPlanningAssessment[],
    predicate: (assessment: StrategicPlanningAssessment) => boolean,
  ): string[] {
    const assessmentByObjectiveId = new Map(
      assessments.map((assessment) => [assessment.objectiveId, assessment]),
    );

    return objectives
      .filter((objective) => {
        const assessment = assessmentByObjectiveId.get(objective.id);

        return assessment ? predicate(assessment) : false;
      })
      .map((objective) => objective.id);
  }

  private calculateReadinessScore(
    assessments: StrategicPlanningAssessment[],
  ): number {
    return clampScore(
      averageScore(
        assessments.map(
          (assessment) =>
            assessment.feasibilityScore * 0.4 +
            assessment.impactScore * 0.35 +
            (100 - assessment.riskExposureScore) * 0.25,
        ),
      ),
    );
  }

  private buildExecutiveGuidance(
    readinessScore: number,
    phaseCount: number,
  ): string {
    if (readinessScore >= 80) {
      return `Strategic readiness is strong across ${phaseCount} roadmap phases. Leadership should prioritize execution acceleration and scaling governance.`;
    }

    if (readinessScore >= 60) {
      return `Strategic readiness is moderate across ${phaseCount} roadmap phases. Leadership should sequence execution carefully and reduce dependency friction.`;
    }

    return `Strategic readiness is limited across ${phaseCount} roadmap phases. Leadership should strengthen planning foundations before broad execution.`;
  }

  private phaseLabel(phaseType: StrategicRoadmapPhaseType): string {
    switch (phaseType) {
      case "foundation":
        return "Foundation Milestone";
      case "acceleration":
        return "Acceleration Milestone";
      case "optimization":
        return "Optimization Milestone";
      case "scale":
        return "Scale Milestone";
      default:
        return "Strategic Milestone";
    }
  }
}