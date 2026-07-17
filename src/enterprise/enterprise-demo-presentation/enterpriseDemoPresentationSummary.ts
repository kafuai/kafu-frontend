import {
  EnterpriseDemoPresentationMetric,
  EnterpriseDemoPresentationSection,
} from "./enterpriseDemoPresentationTypes";

export interface EnterpriseDemoPresentationSummary {
  totalSections: number;
  visibleSections: number;
  totalMetrics: number;
  highlightedMetrics: number;
  criticalMetrics: number;
  successMetrics: number;
}

export function summarizeEnterpriseDemoPresentationSections(
  sections: EnterpriseDemoPresentationSection[],
): EnterpriseDemoPresentationSummary {
  const metrics = sections.flatMap(
    (section) => section.metrics,
  );

  return {
    totalSections: sections.length,
    visibleSections: sections.filter(
      (section) => section.visible,
    ).length,
    totalMetrics: metrics.length,
    highlightedMetrics: countMetricsByEmphasis(
      metrics,
      "highlight",
    ),
    criticalMetrics: countMetricsByEmphasis(
      metrics,
      "critical",
    ),
    successMetrics: countMetricsByEmphasis(
      metrics,
      "success",
    ),
  };
}

function countMetricsByEmphasis(
  metrics: EnterpriseDemoPresentationMetric[],
  emphasis: EnterpriseDemoPresentationMetric["emphasis"],
): number {
  return metrics.filter(
    (metric) => metric.emphasis === emphasis,
  ).length;
}
