import type {
  RevenueIntelligencePipelineSummary,
  RevenueIntelligenceResult,
} from "../../../src/enterprise/ai-revenue-intelligence/revenue-intelligence-orchestrator/RevenueIntelligenceTypes";
import type {
  SalesForecast,
} from "../../../src/enterprise/ai-revenue-intelligence/sales-forecast/SalesForecastTypes";
import type {
  ExecutiveForecast,
} from "../models/ExecutiveForecast";
import type {
  ExecutiveRevenueSummary,
  ExecutiveScore,
  PipelineHealthSnapshot,
} from "../models/ExecutiveRevenueDashboard";

export interface ExecutiveKpiSelection {
  summary: ExecutiveRevenueSummary;
  forecast: ExecutiveForecast;
  pipelineHealth: PipelineHealthSnapshot;
  executiveScore: ExecutiveScore;
}

export interface ExecutiveKpiSelectorInput {
  pipelineResult:
    RevenueIntelligenceResult;

  forecastResult:
    RevenueIntelligenceResult;
}

function requirePipelineSummary(
  result:
    RevenueIntelligenceResult,
): RevenueIntelligencePipelineSummary {
  if (!result.pipelineSummary) {
    throw new Error(
      "Executive KPI selection requires a pipeline summary.",
    );
  }

  return result.pipelineSummary;
}

function requireSalesForecast(
  result:
    RevenueIntelligenceResult,
): SalesForecast {
  if (!result.salesForecast) {
    throw new Error(
      "Executive KPI selection requires a sales forecast.",
    );
  }

  return result.salesForecast;
}

function mapForecastTrend(
  trend:
    SalesForecast["trend"],
): ExecutiveForecast["trend"] {
  if (trend === "improving") {
    return "up";
  }

  if (trend === "declining") {
    return "down";
  }

  return "stable";
}

function clampScore(
  value: number,
): number {
  return Math.min(
    100,
    Math.max(0, value),
  );
}

export function selectExecutiveKpis(
  input:
    ExecutiveKpiSelectorInput,
): ExecutiveKpiSelection {
  const pipeline =
    requirePipelineSummary(
      input.pipelineResult,
    );

  const salesForecast =
    requireSalesForecast(
      input.forecastResult,
    );

  const averageDealSize =
    pipeline.opportunityCount > 0
      ? pipeline.pipelineValue
        / pipeline.opportunityCount
      : 0;

  const summary:
    ExecutiveRevenueSummary = {
      totalRevenue:
        pipeline.pipelineValue,

      committedRevenue:
        salesForecast.commitRevenue,

      weightedRevenue:
        salesForecast.weightedRevenue,

      predictedRevenue:
        salesForecast.predictedRevenue,

      activeOpportunities:
        pipeline.opportunityCount,

      winRate:
        pipeline.averageWinProbability,

      averageDealSize,
    };

  const forecast:
    ExecutiveForecast = {
      predictedRevenue:
        salesForecast.predictedRevenue,

      committedRevenue:
        salesForecast.commitRevenue,

      weightedRevenue:
        salesForecast.weightedRevenue,

      confidence:
        salesForecast.confidence,

      trend:
        mapForecastTrend(
          salesForecast.trend,
        ),

      period: {
        startDate:
          new Date(
            salesForecast.periodStart,
          ),

        endDate:
          new Date(
            salesForecast.periodEnd,
          ),

        label:
          salesForecast.period,
      },
    };

  const pipelineHealth:
    PipelineHealthSnapshot = {
      score:
        clampScore(
          100
          - pipeline.averageRiskScore,
        ),

      trend:
        mapForecastTrend(
          salesForecast.trend,
        ),

      coverage:
        salesForecast.coverageRatio
        ?? 0,

      healthyOpportunities:
        pipeline.healthyCount,

      riskyOpportunities:
        pipeline.atRiskCount
        + pipeline.criticalCount,

      stalledOpportunities:
        pipeline.immediateAttentionCount,
    };

  const executiveScore:
    ExecutiveScore = {
      score:
        clampScore(
          pipeline.averageOpportunityScore,
        ),

      confidence:
        pipeline.averageConfidence,

      generatedAt:
        new Date(
          pipeline.generatedAt,
        ),
    };

  return {
    summary,
    forecast,
    pipelineHealth,
    executiveScore,
  };
}
