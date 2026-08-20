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

  status:
    | "ready"
    | "attention"
    | "building";

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

  executionPriority:
    | "high"
    | "medium";

  connectedModules:
    DashboardEnterpriseIntelligenceModule[];

  nextExecutionStep: string;
}

function clampScore(
  value: number,
): number {
  return Math.max(
    0,
    Math.min(
      100,
      Math.round(value),
    ),
  );
}

function calculateDiscoveryCoverage(
  discoveryAnswersCount: number,
): number {
  /*
   * Ten discovery answers currently represent
   * the confidence boundary already used by
   * Enterprise Intelligence.
   *
   * This converts the actual number of saved
   * discovery answers into a normalized
   * readiness signal without inventing a
   * fixed module score.
   */
  return clampScore(
    (
      Math.max(
        0,
        discoveryAnswersCount,
      ) / 10
    ) * 100,
  );
}

function calculateDigitalWorkforceReadiness(
  input: {
    readinessScore: number;
    corporateBrainScore: number;
    discoveryAnswersCount: number;
  },
): number {
  const discoveryCoverage =
    calculateDiscoveryCoverage(
      input.discoveryAnswersCount,
    );

  /*
   * Digital Workforce readiness depends on:
   *
   * 35% enterprise readiness
   * 45% Corporate Brain readiness
   * 20% discovery evidence coverage
   *
   * These are readiness inputs already derived
   * from the current organization's real data.
   *
   * This score does NOT represent live agent
   * performance or production execution.
   */
  return clampScore(
    input.readinessScore * 0.35
    + input.corporateBrainScore * 0.45
    + discoveryCoverage * 0.2,
  );
}

function calculateCommandCenterReadiness(
  input: {
    readinessScore: number;
    corporateBrainScore: number;
    discoveryAnswersCount: number;
    overdueLeads: number;
  },
): number {
  const discoveryCoverage =
    calculateDiscoveryCoverage(
      input.discoveryAnswersCount,
    );

  const executionDataCoverage =
    clampScore(
      100
      - Math.min(
        Math.max(
          0,
          input.overdueLeads,
        ) * 10,
        50,
      ),
    );

  /*
   * Command Center readiness measures whether
   * the current organization has sufficient
   * enterprise context and manageable
   * execution exposure for executive monitoring.
   *
   * It intentionally does NOT claim that
   * agents or autonomous execution are live.
   */
  return clampScore(
    input.readinessScore * 0.3
    + input.corporateBrainScore * 0.3
    + discoveryCoverage * 0.2
    + executionDataCoverage * 0.2,
  );
}

export function buildDashboardEnterpriseIntelligence(
  input:
    DashboardEnterpriseIntelligenceInput,
): DashboardEnterpriseIntelligenceResult {
  const engine =
    new EnterpriseIntelligenceCore();

  const executionPriority =
    input.overdueLeads > 0
    || input.readinessScore < 60
      ? "high"
      : "medium";

  const confidence =
    input.discoveryAnswersCount >= 10
      ? "high"
      : input.discoveryAnswersCount >= 5
        ? "medium"
        : "low";

  const objective =
    `Executive optimization for ${
      input.companyName
      ?? "Organization"
    }`;

  const reasoning =
    engine.reason({
      organizationId:
        input.organizationId,

      domain:
        "operations",

      objective,

      priority:
        executionPriority,

      confidence,

      inputs: {
        industry:
          input.industry,

        country:
          input.country,

        employeeCount:
          input.employeeCount,

        discoveryAnswersCount:
          input.discoveryAnswersCount,

        readinessScore:
          input.readinessScore,

        corporateBrainScore:
          input.corporateBrainScore,

        overdueLeads:
          input.overdueLeads,
      },
    });

  const decision =
    engine.decide({
      organizationId:
        input.organizationId,

      objective,

      priority:
        executionPriority,

      confidence,

      reasoningSummary:
        reasoning.summary,

      signals:
        reasoning.signals.map(
          (signal) =>
            signal.title,
        ),
    });

  const recommendation =
    engine.recommend({
      organizationId:
        input.organizationId,

      objective,

      decisionTitle:
        decision
          .recommendedOption
          .title,

      decisionRationale:
        decision.rationale,

      priority:
        executionPriority,

      confidence,

      risks:
        decision
          .recommendedOption
          .risks,
    });

  const corporateDnaScore =
    clampScore(
      input.discoveryAnswersCount > 0
        ? input.readinessScore
        : input.readinessScore
          * 0.5,
    );

  const corporateBrainScore =
    clampScore(
      input.corporateBrainScore,
    );

  const digitalWorkforceScore =
    calculateDigitalWorkforceReadiness({
      readinessScore:
        input.readinessScore,

      corporateBrainScore,

      discoveryAnswersCount:
        input.discoveryAnswersCount,
    });

  const commandCenterScore =
    calculateCommandCenterReadiness({
      readinessScore:
        input.readinessScore,

      corporateBrainScore,

      discoveryAnswersCount:
        input.discoveryAnswersCount,

      overdueLeads:
        input.overdueLeads,
    });

  const executiveDashboardScore =
    clampScore(
      (
        corporateDnaScore
        + corporateBrainScore
        + digitalWorkforceScore
        + commandCenterScore
      ) / 4,
    );

  const enterpriseHealthScore =
    clampScore(
      executiveDashboardScore
      - Math.min(
        Math.max(
          0,
          input.overdueLeads,
        ) * 3,
        15,
      ),
    );

  const connectedModules:
    DashboardEnterpriseIntelligenceModule[] = [
      {
        id:
          "corporate-dna",

        title:
          "Corporate DNA",

        status:
          corporateDnaScore >= 70
            ? "ready"
            : corporateDnaScore >= 45
              ? "attention"
              : "building",

        score:
          corporateDnaScore,

        summary:
          input.discoveryAnswersCount > 0
            ? `${input.discoveryAnswersCount} discovery signals connected.`
            : "Discovery inputs are still required.",

        href:
          "/corporate-dna",
      },

      {
        id:
          "corporate-brain",

        title:
          "Corporate Brain",

        status:
          corporateBrainScore >= 70
            ? "ready"
            : corporateBrainScore >= 45
              ? "attention"
              : "building",

        score:
          corporateBrainScore,

        summary:
          corporateBrainScore >= 70
            ? "Enterprise knowledge is ready for decision support."
            : "Additional knowledge sources will improve intelligence quality.",

        href:
          "/corporate-brain",
      },

      {
        id:
          "digital-workforce",

        title:
          "Digital Workforce",

        status:
          digitalWorkforceScore >= 75
            ? "ready"
            : digitalWorkforceScore >= 50
              ? "attention"
              : "building",

        score:
          digitalWorkforceScore,

        summary:
          digitalWorkforceScore >= 75
            ? "Enterprise context supports staged digital workforce activation."
            : digitalWorkforceScore >= 50
              ? "Digital workforce activation requires additional enterprise readiness."
              : "Digital workforce readiness is still being established.",

        href:
          "/digital-workforce",
      },

      {
        id:
          "command-center",

        title:
          "AI Command Center",

        status:
          commandCenterScore >= 75
          && input.overdueLeads === 0
            ? "ready"
            : commandCenterScore >= 50
              ? "attention"
              : "building",

        score:
          commandCenterScore,

        summary:
          input.overdueLeads > 0
            ? `${input.overdueLeads} overdue items require executive attention.`
            : commandCenterScore >= 75
              ? "Current enterprise context supports executive monitoring."
              : "Additional enterprise context will improve command-center readiness.",

        href:
          "/command-center",
      },

      {
        id:
          "executive-dashboard",

        title:
          "Executive Dashboard",

        status:
          executiveDashboardScore >= 75
            ? "ready"
            : executiveDashboardScore >= 50
              ? "attention"
              : "building",

        score:
          executiveDashboardScore,

        summary:
          "Enterprise intelligence is consolidated from current organization and execution signals.",

        href:
          "/dashboard",
      },
    ];

  const nextExecutionStep =
    input.overdueLeads > 0
      ? "Resolve overdue execution items through AI Command Center."
      : corporateBrainScore < 70
        ? "Complete priority knowledge sources inside Corporate Brain."
        : digitalWorkforceScore < 75
          ? "Increase digital workforce readiness before staged activation."
          : commandCenterScore < 75
            ? "Complete command-center readiness before expanding execution."
            : "Proceed with staged digital workforce activation and measure outcomes.";

  return {
    reasoningSummary:
      reasoning.summary,

    decisionTitle:
      decision
        .recommendedOption
        .title,

    recommendationSummary:
      recommendation.summary,

    confidence:
      recommendation.confidence,

    enterpriseHealthScore,

    executionPriority,

    connectedModules,

    nextExecutionStep,
  };
}
