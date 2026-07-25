import type {
  RevenueIntelligenceResult,
} from "../../../src/enterprise/ai-revenue-intelligence/revenue-intelligence-orchestrator/RevenueIntelligenceTypes";
import type {
  ExecutiveRevenueDashboard,
} from "../models/ExecutiveRevenueDashboard";
import type {
  ExecutiveRevenueWidget,
  ExecutiveRevenueWidgetPriority,
} from "../models/ExecutiveRevenueWidget";
import {
  selectAiInsights,
} from "./ai-insights.selector";
import {
  selectExecutiveKpis,
} from "./executive-kpi.selector";
import {
  selectRevenueAlerts,
} from "./revenue-alert.selector";

export interface RevenueDashboardSelectorInput {
  workspaceId: string;

  pipelineResult:
    RevenueIntelligenceResult;

  forecastResult:
    RevenueIntelligenceResult;

  opportunityResults:
    readonly RevenueIntelligenceResult[];
}

function selectWidgetPriority(
  input: {
    criticalCount: number;
    atRiskCount: number;
    immediateAttentionCount: number;
  },
): ExecutiveRevenueWidgetPriority {
  if (
    input.criticalCount > 0
    || input.immediateAttentionCount > 0
  ) {
    return "critical";
  }

  if (input.atRiskCount > 0) {
    return "high";
  }

  return "medium";
}

export function selectExecutiveRevenueDashboard(
  input:
    RevenueDashboardSelectorInput,
): ExecutiveRevenueDashboard {
  const kpis =
    selectExecutiveKpis({
      pipelineResult:
        input.pipelineResult,

      forecastResult:
        input.forecastResult,
    });

  const alerts =
    selectRevenueAlerts({
      workspaceId:
        input.workspaceId,

      pipelineResult:
        input.pipelineResult,

      forecastResult:
        input.forecastResult,

      opportunityResults:
        input.opportunityResults,
    });

  const insights =
    selectAiInsights({
      workspaceId:
        input.workspaceId,

      pipelineResult:
        input.pipelineResult,

      forecastResult:
        input.forecastResult,

      opportunityResults:
        input.opportunityResults,
    });

  const pipeline =
    input.pipelineResult
      .pipelineSummary;

  const forecast =
    input.forecastResult
      .salesForecast;

  if (!pipeline || !forecast) {
    throw new Error(
      "Executive revenue dashboard requires pipeline and forecast results.",
    );
  }

  const widgetPriority =
    selectWidgetPriority({
      criticalCount:
        pipeline.criticalCount,

      atRiskCount:
        pipeline.atRiskCount,

      immediateAttentionCount:
        pipeline.immediateAttentionCount,
    });

  const widgets:
    ExecutiveRevenueWidget[] = [
      {
        id:
          "executive-widget:revenue-forecast",

        workspaceId:
          input.workspaceId,

        type:
          "revenue-forecast",

        title:
          "Revenue Forecast",

        priority:
          forecast.health === "critical"
            ? "critical"
            : forecast.health === "at-risk"
              ? "high"
              : "medium",

        order: 1,
        enabled: true,

        payload: {
          predictedRevenue:
            forecast.predictedRevenue,

          committedRevenue:
            forecast.commitRevenue,

          weightedRevenue:
            forecast.weightedRevenue,

          confidence:
            forecast.confidence,

          trend:
            forecast.trend,

          health:
            forecast.health,
        },
      },

      {
        id:
          "executive-widget:pipeline-health",

        workspaceId:
          input.workspaceId,

        type:
          "pipeline-health",

        title:
          "Pipeline Health",

        priority:
          widgetPriority,

        order: 2,
        enabled: true,

        payload: {
          pipelineValue:
            pipeline.pipelineValue,

          expectedRevenue:
            pipeline.expectedRevenue,

          revenueAtRisk:
            pipeline.revenueAtRisk,

          healthyCount:
            pipeline.healthyCount,

          watchCount:
            pipeline.watchCount,

          atRiskCount:
            pipeline.atRiskCount,

          criticalCount:
            pipeline.criticalCount,
        },
      },

      {
        id:
          "executive-widget:executive-score",

        workspaceId:
          input.workspaceId,

        type:
          "executive-score",

        title:
          "Executive Revenue Score",

        priority: "medium",

        order: 3,
        enabled: true,

        payload: {
          score:
            kpis.executiveScore.score,

          confidence:
            kpis.executiveScore
              .confidence,

          generatedAt:
            kpis.executiveScore
              .generatedAt
              .toISOString(),
        },
      },

      {
        id:
          "executive-widget:risk-detection",

        workspaceId:
          input.workspaceId,

        type:
          "risk-detection",

        title:
          "Predictive Risk Detection",

        priority:
          widgetPriority,

        order: 4,
        enabled: true,

        payload: {
          revenueAtRisk:
            pipeline.revenueAtRisk,

          immediateAttentionCount:
            pipeline.immediateAttentionCount,

          topRiskOpportunityIds:
            pipeline.topRiskOpportunityIds,
        },
      },

      {
        id:
          "executive-widget:revenue-prediction",

        workspaceId:
          input.workspaceId,

        type:
          "revenue-prediction",

        title:
          "Revenue Prediction",

        priority: "medium",

        order: 5,
        enabled: true,

        payload: {
          pipelineExpectedRevenue:
            pipeline.expectedRevenue,

          forecastPredictedRevenue:
            forecast.predictedRevenue,

          weightedRevenue:
            forecast.weightedRevenue,

          confidence:
            forecast.confidence,
        },
      },

      {
        id:
          "executive-widget:ai-recommendation",

        workspaceId:
          input.workspaceId,

        type:
          "ai-recommendation",

        title:
          "AI Executive Recommendations",

        priority:
          alerts.some(
            (alert) =>
              alert.severity
              === "critical",
          )
            ? "critical"
            : alerts.some(
                (alert) =>
                  alert.severity
                  === "high",
              )
              ? "high"
              : "medium",

        order: 6,
        enabled:
          insights.length > 0,

        payload: {
          insightCount:
            insights.length,

          alertCount:
            alerts.length,

          topInsight:
            insights[0],

          topAlert:
            alerts[0],
        },
      },
    ];

  return {
    workspaceId:
      input.workspaceId,

    generatedAt:
      new Date(
        input.forecastResult
          .completedAt,
      ),

    summary:
      kpis.summary,

    forecast:
      kpis.forecast,

    pipelineHealth:
      kpis.pipelineHealth,

    executiveScore:
      kpis.executiveScore,

    alerts,
    insights,
    widgets,
  };
}
