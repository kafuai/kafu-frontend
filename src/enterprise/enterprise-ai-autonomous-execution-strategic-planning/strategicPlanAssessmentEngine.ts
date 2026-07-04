import {
  StrategicPlanningAssessment,
  StrategicPlanningContext,
  StrategicPlanningResult,
} from "./strategicPlanning.types";

const clampScore = (value: number): number => Math.max(0, Math.min(100, value));

const scoreFromCount = (
  positiveCount: number,
  negativeCount: number,
  baseScore: number,
): number => {
  return clampScore(baseScore + positiveCount * 8 - negativeCount * 7);
};

const resolveConfidence = (
  feasibilityScore: number,
  impactScore: number,
  riskExposureScore: number,
): StrategicPlanningAssessment["confidence"] => {
  const average = (feasibilityScore + impactScore + (100 - riskExposureScore)) / 3;

  if (average >= 85) return "validated";
  if (average >= 70) return "strong";
  if (average >= 50) return "moderate";
  return "low";
};

const buildRecommendedFocus = (
  feasibilityScore: number,
  impactScore: number,
  urgencyScore: number,
  riskExposureScore: number,
): string => {
  if (riskExposureScore >= 75) {
    return "Reduce strategic risk before scaling execution.";
  }

  if (impactScore >= 80 && feasibilityScore >= 70) {
    return "Prioritize as a near-term strategic execution pillar.";
  }

  if (urgencyScore >= 80) {
    return "Accelerate planning alignment and unblock dependencies.";
  }

  if (feasibilityScore < 50) {
    return "Refine scope and improve readiness before commitment.";
  }

  return "Maintain as a planned strategic initiative with monitored execution.";
};

export class StrategicPlanAssessmentEngine {
  assess(context: StrategicPlanningContext): StrategicPlanningResult {
    const assessments: StrategicPlanningAssessment[] =
      context.strategicObjectives.map((objective) => {
        const feasibilityScore = scoreFromCount(
          objective.successMetrics.length,
          objective.dependencies.length + context.operationalConstraints.length,
          72,
        );

        const impactScore = scoreFromCount(
          objective.successMetrics.length + context.marketSignals.length,
          objective.risks.length,
          68,
        );

        const urgencyScore = scoreFromCount(
          context.executionSignals.length,
          objective.dependencies.length,
          objective.priority === "critical" ? 82 : objective.priority === "high" ? 72 : 58,
        );

        const dependencyComplexityScore = clampScore(
          objective.dependencies.length * 18 + context.operationalConstraints.length * 12,
        );

        const riskExposureScore = clampScore(
          objective.risks.length * 20 + context.operationalConstraints.length * 10,
        );

        return {
          objectiveId: objective.id,
          feasibilityScore,
          impactScore,
          urgencyScore,
          dependencyComplexityScore,
          riskExposureScore,
          confidence: resolveConfidence(feasibilityScore, impactScore, riskExposureScore),
          recommendedFocus: buildRecommendedFocus(
            feasibilityScore,
            impactScore,
            urgencyScore,
            riskExposureScore,
          ),
        };
      });

    const strategicThemes = this.extractStrategicThemes(context, assessments);

    return {
      organizationId: context.organizationId,
      planningHorizon: context.planningHorizon,
      assessments,
      strategicThemes,
      executiveSummary: this.buildExecutiveSummary(context, assessments),
      generatedAt: new Date().toISOString(),
    };
  }

  private extractStrategicThemes(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): string[] {
    const themes = new Set<string>();

    if (context.marketSignals.length > 0) {
      themes.add("Market-responsive strategic positioning");
    }

    if (context.executionSignals.length > 0) {
      themes.add("Execution-informed prioritization");
    }

    if (assessments.some((assessment) => assessment.riskExposureScore >= 70)) {
      themes.add("Risk-aware strategic sequencing");
    }

    if (assessments.some((assessment) => assessment.impactScore >= 80)) {
      themes.add("High-impact initiative acceleration");
    }

    if (themes.size === 0) {
      themes.add("Structured strategic planning baseline");
    }

    return Array.from(themes);
  }

  private buildExecutiveSummary(
    context: StrategicPlanningContext,
    assessments: StrategicPlanningAssessment[],
  ): string {
    const highPriorityCount = context.strategicObjectives.filter(
      (objective) => objective.priority === "high" || objective.priority === "critical",
    ).length;

    const validatedCount = assessments.filter(
      (assessment) => assessment.confidence === "validated",
    ).length;

    return `Strategic planning assessment completed for ${context.strategicObjectives.length} objectives across a ${context.planningHorizon} horizon. ${highPriorityCount} objectives are high-priority or critical, with ${validatedCount} validated for strong execution confidence.`;
  }
}