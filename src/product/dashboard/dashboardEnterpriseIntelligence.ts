import { EnterpriseIntelligenceCore } from "../../enterprise/intelligence";

export interface DashboardEnterpriseIntelligenceInput {
  organizationId: string;
  companyName?: string | null;
  industry?: string | null;
  country?: string | null;
  employeeCount?: number | null;
  discoveryAnswersCount: number;
  readinessScore: number;
  corporateBrainScore: number;
  overdueLeads: number;
}

export interface DashboardEnterpriseIntelligenceResult {
  reasoningSummary: string;
  decisionTitle: string;
  recommendationSummary: string;
  confidence: string;
}

export function buildDashboardEnterpriseIntelligence(
  input: DashboardEnterpriseIntelligenceInput,
): DashboardEnterpriseIntelligenceResult {
  const engine = new EnterpriseIntelligenceCore();

  const priority =
    input.overdueLeads > 0 || input.readinessScore < 60
      ? "high"
      : "medium";

  const confidence =
    input.discoveryAnswersCount >= 10
      ? "high"
      : input.discoveryAnswersCount >= 5
        ? "medium"
        : "low";

  const objective = `Executive optimization for ${
    input.companyName ?? "Organization"
  }`;

  const reasoning = engine.reason({
    organizationId: input.organizationId,
    domain: "operations",
    objective,
    priority,
    confidence,
    inputs: {
      industry: input.industry,
      country: input.country,
      employeeCount: input.employeeCount,
      readinessScore: input.readinessScore,
      corporateBrainScore: input.corporateBrainScore,
      overdueLeads: input.overdueLeads,
    },
  });

  const decision = engine.decide({
    organizationId: input.organizationId,
    objective,
    priority,
    confidence,
    reasoningSummary: reasoning.summary,
    signals: reasoning.signals.map((signal) => signal.title),
  });

  const recommendation = engine.recommend({
    organizationId: input.organizationId,
    objective,
    decisionTitle: decision.recommendedOption.title,
    decisionRationale: decision.rationale,
    priority,
    confidence,
    risks: decision.recommendedOption.risks,
  });

  return {
    reasoningSummary: reasoning.summary,
    decisionTitle: decision.recommendedOption.title,
    recommendationSummary: recommendation.summary,
    confidence: recommendation.confidence,
  };
}