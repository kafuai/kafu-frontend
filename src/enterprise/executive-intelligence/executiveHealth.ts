import type {
  ExecutiveHealthDimension,
  ExecutiveHealthStatus,
  OrganizationHealth,
} from "./executiveKpiTypes";

export interface OrganizationHealthInput {
  revenueAttainment: number;
  forecastConfidence: number;
  weightedCoverage: number;
  winRate: number;
  opportunityHealthRatio: number;
  executionReadiness: number;
  generatedAt?: string;
}

function clampScore(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(100, Math.max(0, Math.round(value)));
}

function clampRatio(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.min(1, Math.max(0, value));
}

export function resolveExecutiveHealthStatus(
  score: number,
): ExecutiveHealthStatus {
  if (score >= 75) {
    return "healthy";
  }

  if (score >= 50) {
    return "attention";
  }

  return "critical";
}

function createDimension(input: {
  id: string;
  label: string;
  score: number;
  weight: number;
  explanation: string;
}): ExecutiveHealthDimension {
  const score = clampScore(input.score);
  const weight = clampRatio(input.weight);

  return {
    id: input.id,
    label: input.label,
    score,
    weight,
    weightedScore: score * weight,
    status: resolveExecutiveHealthStatus(score),
    explanation: input.explanation,
  };
}

export function calculateOrganizationHealth(
  input: OrganizationHealthInput,
): OrganizationHealth {
  const generatedAt = input.generatedAt ?? new Date().toISOString();

  const revenueScore = clampScore(
    input.revenueAttainment * 55 +
      input.forecastConfidence * 25 +
      Math.min(input.weightedCoverage, 1) * 20,
  );

  const salesScore = clampScore(
    input.winRate * 55 +
      input.opportunityHealthRatio * 45,
  );

  const executionScore = clampScore(
    input.executionReadiness * 100,
  );

  const dimensions = [
    createDimension({
      id: "revenue-health",
      label: "صحة الإيرادات",
      score: revenueScore,
      weight: 0.45,
      explanation:
        "تقيس تحقيق هدف الإيرادات وثقة التوقع وتغطية خط المبيعات المرجّحة.",
    }),
    createDimension({
      id: "sales-health",
      label: "صحة المبيعات",
      score: salesScore,
      weight: 0.35,
      explanation:
        "تقيس معدل الفوز وجودة وصحة الفرص النشطة.",
    }),
    createDimension({
      id: "execution-health",
      label: "الجاهزية التنفيذية",
      score: executionScore,
      weight: 0.2,
      explanation:
        "تقيس وضوح الخطوات التالية واستعداد الفريق للتنفيذ.",
    }),
  ];

  const score = clampScore(
    dimensions.reduce(
      (total, dimension) =>
        total + dimension.weightedScore,
      0,
    ),
  );

  return {
    score,
    status: resolveExecutiveHealthStatus(score),
    dimensions,
    criticalDimensions: dimensions.filter(
      (dimension) => dimension.status === "critical",
    ).length,
    attentionDimensions: dimensions.filter(
      (dimension) => dimension.status === "attention",
    ).length,
    generatedAt,
  };
}