import {
  SustainabilityAssessment,
  SustainabilityMetric,
  SustainabilityMetricCategory,
  SustainabilityScope,
  SustainabilityTimeWindow,
} from "./sustainabilityTypes";
import { SustainabilityRecommendation } from "./sustainabilityRecommendation";

export type SustainabilityReportSummary = {
  totalMetrics: number;
  averageScore: number;
  categoryTotals: Record<SustainabilityMetricCategory, number>;
  recommendationCount: number;
};

export type SustainabilityReport = {
  id: string;
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  window: SustainabilityTimeWindow;
  summary: SustainabilityReportSummary;
  metrics: SustainabilityMetric[];
  assessments: SustainabilityAssessment[];
  recommendations: SustainabilityRecommendation[];
  generatedAt: Date;
};

const emptyCategoryTotals: Record<SustainabilityMetricCategory, number> = {
  carbon: 0,
  energy: 0,
  resource: 0,
  waste: 0,
  efficiency: 0,
  compliance: 0,
};

export function generateSustainabilityReport(input: {
  organizationId: string;
  scope: SustainabilityScope;
  scopeId: string;
  window: SustainabilityTimeWindow;
  metrics: SustainabilityMetric[];
  assessments: SustainabilityAssessment[];
  recommendations: SustainabilityRecommendation[];
}): SustainabilityReport {
  const categoryTotals = input.metrics.reduce(
    (totals, metric) => ({
      ...totals,
      [metric.category]: Number(
        ((totals[metric.category] ?? 0) + metric.value).toFixed(4),
      ),
    }),
    { ...emptyCategoryTotals },
  );

  const averageScore =
    input.assessments.length === 0
      ? 0
      : Math.round(
          input.assessments.reduce(
            (sum, assessment) => sum + assessment.score,
            0,
          ) / input.assessments.length,
        );

  return {
    id: `${input.organizationId}:${input.scope}:${input.scopeId}:sustainability-report`,
    organizationId: input.organizationId,
    scope: input.scope,
    scopeId: input.scopeId,
    window: input.window,
    summary: {
      totalMetrics: input.metrics.length,
      averageScore,
      categoryTotals,
      recommendationCount: input.recommendations.length,
    },
    metrics: input.metrics,
    assessments: input.assessments,
    recommendations: input.recommendations,
    generatedAt: new Date(),
  };
}