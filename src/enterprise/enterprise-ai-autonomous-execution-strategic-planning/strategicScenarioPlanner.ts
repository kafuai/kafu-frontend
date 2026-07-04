import {
  StrategicObjective,
  StrategicPlanningAssessment,
  StrategicPlanningContext,
} from "./strategicPlanning.types";

export type StrategicScenarioType =
  | "baseline"
  | "growth"
  | "constraint"
  | "risk_mitigation";

export interface StrategicScenario {
  id: string;
  type: StrategicScenarioType;
  name: string;
  objectiveIds: string[];
  assumptions: string[];
  expectedBenefits: string[];
  tradeoffs: string[];
  planningScore: number;
}

export interface StrategicScenarioPlan {
  organizationId: string;
  scenarios: StrategicScenario[];
  preferredScenarioId: string | null;
  rationale: string;
  generatedAt: string;
}

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));

const averageScore = (values: number[]): number => {
  if (values.length === 0) return 0;

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
};

export class StrategicScenarioPlanner {
  plan(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): StrategicScenarioPlan {
    const scenarios = [
      this.buildBaselineScenario(context, assessments),
      this.buildGrowthScenario(context, assessments),
      this.buildConstraintScenario(context, assessments),
      this.buildRiskMitigationScenario(context, assessments),
    ];

    const preferredScenario =
      scenarios.length > 0
        ? [...scenarios].sort((left, right) => right.planningScore - left.planningScore)[0]
        : null;

    return {
      organizationId: context.organizationId,
      scenarios,
      preferredScenarioId: preferredScenario?.id ?? null,
      rationale: preferredScenario
        ? `Preferred scenario selected based on highest strategic planning score: ${preferredScenario.name}.`
        : "No preferred scenario could be selected because no scenarios were generated.",
      generatedAt: new Date().toISOString(),
    };
  }

  private buildBaselineScenario(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): StrategicScenario {
    return {
      id: "scenario-baseline",
      type: "baseline",
      name: "Baseline Strategic Continuity",
      objectiveIds: context.strategicObjectives.map((objective) => objective.id),
      assumptions: [
        "Current execution capacity remains stable.",
        "Existing strategic objectives remain valid.",
      ],
      expectedBenefits: [
        "Maintains planning continuity.",
        "Supports controlled execution without aggressive expansion.",
      ],
      tradeoffs: [
        "May underuse high-impact growth opportunities.",
        "May not fully address urgent market changes.",
      ],
      planningScore: clampScore(
        averageScore(assessments.map((assessment) => assessment.feasibilityScore)),
      ),
    };
  }

  private buildGrowthScenario(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): StrategicScenario {
    const selectedObjectives = this.selectObjectives(
      context.strategicObjectives,
      assessments,
      (assessment) => assessment.impactScore >= 75 && assessment.riskExposureScore < 70,
    );

    return {
      id: "scenario-growth",
      type: "growth",
      name: "High-Impact Strategic Growth",
      objectiveIds: selectedObjectives.map((objective) => objective.id),
      assumptions: [
        "High-impact initiatives receive additional leadership attention.",
        "Execution capacity can be shifted toward strategic growth.",
      ],
      expectedBenefits: [
        "Accelerates strategic outcomes.",
        "Improves market responsiveness and enterprise momentum.",
      ],
      tradeoffs: [
        "Requires stronger execution coordination.",
        "May increase short-term dependency pressure.",
      ],
      planningScore: clampScore(
        averageScore(
          assessments.map(
            (assessment) => assessment.impactScore - assessment.riskExposureScore * 0.25,
          ),
        ),
      ),
    };
  }

  private buildConstraintScenario(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): StrategicScenario {
    const selectedObjectives = this.selectObjectives(
      context.strategicObjectives,
      assessments,
      (assessment) => assessment.dependencyComplexityScore < 65,
    );

    return {
      id: "scenario-constraint",
      type: "constraint",
      name: "Constraint-Aware Strategic Sequencing",
      objectiveIds: selectedObjectives.map((objective) => objective.id),
      assumptions: [
        "Operational constraints require selective sequencing.",
        "Lower-complexity initiatives should move first.",
      ],
      expectedBenefits: [
        "Reduces execution friction.",
        "Improves delivery reliability under constrained resources.",
      ],
      tradeoffs: [
        "Some high-impact initiatives may be delayed.",
        "May require additional planning cycles for complex objectives.",
      ],
      planningScore: clampScore(
        averageScore(
          assessments.map(
            (assessment) => 100 - assessment.dependencyComplexityScore,
          ),
        ),
      ),
    };
  }

  private buildRiskMitigationScenario(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): StrategicScenario {
    const selectedObjectives = this.selectObjectives(
      context.strategicObjectives,
      assessments,
      (assessment) => assessment.riskExposureScore >= 60,
    );

    return {
      id: "scenario-risk-mitigation",
      type: "risk_mitigation",
      name: "Risk-Reduced Strategic Execution",
      objectiveIds: selectedObjectives.map((objective) => objective.id),
      assumptions: [
        "Risk-heavy initiatives require mitigation before scale.",
        "Strategic confidence improves when exposure is reduced early.",
      ],
      expectedBenefits: [
        "Improves enterprise resilience.",
        "Protects strategic execution from avoidable disruption.",
      ],
      tradeoffs: [
        "May slow immediate execution speed.",
        "Requires governance alignment before acceleration.",
      ],
      planningScore: clampScore(
        averageScore(
          assessments.map(
            (assessment) =>
              assessment.feasibilityScore + (100 - assessment.riskExposureScore) * 0.3,
          ),
        ),
      ),
    };
  }

  private selectObjectives(
    objectives: StrategicObjective[],
    assessments: StrategicPlanningAssessment[],
    predicate: (assessment: StrategicPlanningAssessment) => boolean,
  ): StrategicObjective[] {
    const selectedObjectiveIds = new Set(
      assessments
        .filter(predicate)
        .map((assessment) => assessment.objectiveId),
    );

    return objectives.filter((objective) => selectedObjectiveIds.has(objective.id));
  }
}