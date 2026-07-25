import type {
  RevenueIntelligenceOpportunitySnapshot,
  RevenueIntelligenceResult,
} from "../../../src/enterprise/ai-revenue-intelligence/revenue-intelligence-orchestrator/RevenueIntelligenceTypes";
import type {
  ExecutiveAlert,
  ExecutiveAlertSeverity,
} from "../models/ExecutiveAlert";

export interface RevenueAlertSelectorInput {
  workspaceId: string;

  pipelineResult:
    RevenueIntelligenceResult;

  forecastResult:
    RevenueIntelligenceResult;

  opportunityResults:
    readonly RevenueIntelligenceResult[];
}

function createAlertId(
  category: ExecutiveAlert["category"],
  suffix: string,
): string {
  return [
    "executive-alert",
    category,
    suffix,
  ].join(":");
}

function severityFromHealth(
  health:
    | "healthy"
    | "watch"
    | "at-risk"
    | "critical",
): ExecutiveAlertSeverity {
  if (health === "critical") {
    return "critical";
  }

  if (health === "at-risk") {
    return "high";
  }

  if (health === "watch") {
    return "medium";
  }

  return "info";
}

function selectOpportunityAlert(
  workspaceId: string,
  snapshot:
    RevenueIntelligenceOpportunitySnapshot,
): ExecutiveAlert | null {
  if (
    snapshot.health === "healthy"
    && !snapshot.immediateAttentionRequired
  ) {
    return null;
  }

  const primaryRisk =
    snapshot.dealRisk
      .explanation
      .primaryRisks[0];

  return {
    id:
      createAlertId(
        "deal-risk",
        snapshot.opportunityId,
      ),

    workspaceId,

    severity:
      snapshot.immediateAttentionRequired
        ? "critical"
        : severityFromHealth(
            snapshot.health,
          ),

    category:
      snapshot.immediateAttentionRequired
        ? "executive-attention"
        : "deal-risk",

    title:
      snapshot.immediateAttentionRequired
        ? "Opportunity requires immediate executive attention"
        : "Opportunity risk detected",

    description:
      primaryRisk
      ?? snapshot.dealRisk
        .explanation
        .summary,

    createdAt:
      new Date(
        snapshot.generatedAt,
      ),

    opportunityId:
      snapshot.opportunityId,

    dismissed: false,
  };
}

export function selectRevenueAlerts(
  input:
    RevenueAlertSelectorInput,
): ExecutiveAlert[] {
  const alerts:
    ExecutiveAlert[] = [];

  const pipeline =
    input.pipelineResult.pipelineSummary;

  if (
    pipeline
    && pipeline.criticalCount > 0
  ) {
    alerts.push({
      id:
        createAlertId(
          "pipeline-health",
          pipeline.generatedAt,
        ),

      workspaceId:
        input.workspaceId,

      severity: "critical",

      category:
        "pipeline-health",

      title:
        "Critical opportunities detected in the pipeline",

      description:
        `${pipeline.criticalCount} opportunities are currently classified as critical, with ${pipeline.revenueAtRisk} in revenue at risk.`,

      createdAt:
        new Date(
          pipeline.generatedAt,
        ),

      dismissed: false,
    });
  } else if (
    pipeline
    && pipeline.atRiskCount > 0
  ) {
    alerts.push({
      id:
        createAlertId(
          "pipeline-health",
          pipeline.generatedAt,
        ),

      workspaceId:
        input.workspaceId,

      severity: "high",

      category:
        "pipeline-health",

      title:
        "Pipeline health requires attention",

      description:
        `${pipeline.atRiskCount} opportunities are at risk, representing ${pipeline.revenueAtRisk} in exposed revenue.`,

      createdAt:
        new Date(
          pipeline.generatedAt,
        ),

      dismissed: false,
    });
  }

  const salesForecast =
    input.forecastResult.salesForecast;

  if (
    salesForecast
    && salesForecast.health !== "healthy"
  ) {
    alerts.push({
      id:
        createAlertId(
          "forecast-deviation",
          salesForecast.calculatedAt,
        ),

      workspaceId:
        input.workspaceId,

      severity:
        severityFromHealth(
          salesForecast.health,
        ),

      category:
        "forecast-deviation",

      title:
        "Revenue forecast requires review",

      description:
        salesForecast.explanation
          .risks[0]
        ?? salesForecast.explanation
          .summary,

      createdAt:
        new Date(
          salesForecast.calculatedAt,
        ),

      dismissed: false,
    });
  }

  for (
    const result
    of input.opportunityResults
  ) {
    const snapshot =
      result.opportunitySnapshot;

    if (!snapshot) {
      continue;
    }

    const alert =
      selectOpportunityAlert(
        input.workspaceId,
        snapshot,
      );

    if (alert) {
      alerts.push(alert);
    }
  }

  return alerts.sort(
    (left, right) => {
      const order:
        Record<
          ExecutiveAlertSeverity,
          number
        > = {
          critical: 5,
          high: 4,
          medium: 3,
          low: 2,
          info: 1,
        };

      return (
        order[right.severity]
        - order[left.severity]
      );
    },
  );
}
