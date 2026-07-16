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

export interface DashboardEnterpriseIntelligenceModule {
  id:
    | "corporate-dna"
    | "corporate-brain"
    | "digital-workforce"
    | "command-center"
    | "executive-dashboard";
  title: string;
  status: "ready" | "attention" | "building";
  score: number;
  summary: string;
  href: string;
}

export interface DashboardEnterpriseIntelligenceResult {
  reasoningSummary: string;
  decisionTitle: string;
  recommendationSummary: string;
  confidence: string;
  enterpriseHealthScore: number;
  executionPriority: "high" | "medium";
  connectedModules: DashboardEnterpriseIntelligenceModule[];
  nextExecutionStep: string;
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export function buildDashboardEnterpriseIntelligence(
  input: DashboardEnterpriseIntelligenceInput,
): DashboardEnterpriseIntelligenceResult {
  const engine = new EnterpriseIntelligenceCore();

  const executionPriority =
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
    priority: executionPriority,
    confidence,
    inputs: {
      industry: input.industry,
      country: input.country,
      employeeCount: input.employeeCount,
      discoveryAnswersCount: input.discoveryAnswersCount,
      readinessScore: input.readinessScore,
      corporateBrainScore: input.corporateBrainScore,
      overdueLeads: input.overdueLeads,
    },
  });

  const decision = engine.decide({
    organizationId: input.organizationId,
    objective,
    priority: executionPriority,
    confidence,
    reasoningSummary: reasoning.summary,
    signals: reasoning.signals.map((signal) => signal.title),
  });

  const recommendation = engine.recommend({
    organizationId: input.organizationId,
    objective,
    decisionTitle: decision.recommendedOption.title,
    decisionRationale: decision.rationale,
    priority: executionPriority,
    confidence,
    risks: decision.recommendedOption.risks,
  });

  const corporateDnaScore = clampScore(
    input.discoveryAnswersCount > 0
      ? input.readinessScore
      : input.readinessScore * 0.5,
  );

  const corporateBrainScore = clampScore(
    input.corporateBrainScore,
  );

  const digitalWorkforceScore = clampScore(
    corporateBrainScore >= 70
      ? 82
      : corporateBrainScore >= 50
        ? 68
        : 45,
  );

  const commandCenterScore = clampScore(
    input.overdueLeads > 0 ? 72 : 88,
  );

  const executiveDashboardScore = clampScore(
    (
      corporateDnaScore +
      corporateBrainScore +
      digitalWorkforceScore +
      commandCenterScore
    ) / 4,
  );

  const enterpriseHealthScore = clampScore(
    executiveDashboardScore -
      Math.min(input.overdueLeads * 3, 15),
  );

  const connectedModules: DashboardEnterpriseIntelligenceModule[] = [
    {
      id: "corporate-dna",
      title: "Corporate DNA",
      status:
        corporateDnaScore >= 70
          ? "ready"
          : corporateDnaScore >= 45
            ? "attention"
            : "building",
      score: corporateDnaScore,
      summary:
        input.discoveryAnswersCount > 0
          ? `${input.discoveryAnswersCount} discovery signals connected.`
          : "Discovery inputs are still required.",
      href: "/corporate-dna",
    },
    {
      id: "corporate-brain",
      title: "Corporate Brain",
      status:
        corporateBrainScore >= 70
          ? "ready"
          : corporateBrainScore >= 45
            ? "attention"
            : "building",
      score: corporateBrainScore,
      summary:
        corporateBrainScore >= 70
          ? "Enterprise knowledge is ready for decision support."
          : "Additional knowledge sources will improve intelligence quality.",
      href: "/corporate-brain",
    },
    {
      id: "digital-workforce",
      title: "Digital Workforce",
      status:
        digitalWorkforceScore >= 75
          ? "ready"
          : "attention",
      score: digitalWorkforceScore,
      summary:
        digitalWorkforceScore >= 75
          ? "Recommended digital agents are ready for staged activation."
          : "Agent activation depends on stronger enterprise knowledge.",
      href: "/digital-workforce",
    },
    {
      id: "command-center",
      title: "AI Command Center",
      status:
        input.overdueLeads > 0
          ? "attention"
          : "ready",
      score: commandCenterScore,
      summary:
        input.overdueLeads > 0
          ? `${input.overdueLeads} overdue items require executive attention.`
          : "Enterprise monitoring is operating normally.",
      href: "/command-center",
    },
    {
      id: "executive-dashboard",
      title: "Executive Dashboard",
      status:
        executiveDashboardScore >= 75
          ? "ready"
          : "attention",
      score: executiveDashboardScore,
      summary:
        "Enterprise intelligence is consolidated for executive review.",
      href: "/dashboard",
    },
  ];

  const nextExecutionStep =
    input.overdueLeads > 0
      ? "Resolve overdue execution items through AI Command Center."
      : corporateBrainScore < 70
        ? "Complete priority knowledge sources inside Corporate Brain."
        : digitalWorkforceScore < 75
          ? "Prepare the first digital agent for staged activation."
          : "Activate the first digital workforce workflow and monitor outcomes.";

  return {
    reasoningSummary: reasoning.summary,
    decisionTitle: decision.recommendedOption.title,
    recommendationSummary: recommendation.summary,
    confidence: recommendation.confidence,
    enterpriseHealthScore,
    executionPriority,
    connectedModules,
    nextExecutionStep,
  };
}