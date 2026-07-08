import type {
  RevenueMetric,
  RevenueTimeframe,
} from "./revenueOperationsTypes";

export interface RevenueForecastInput {
  committedRevenue: number;
  bestCaseRevenue: number;
  pipelineCoverage: number;
  historicalAccuracy: number;
}

export interface RevenueForecast {
  id: string;
  timeframe: RevenueTimeframe;
  forecastAmount: number;
  confidence: number;
  metrics: RevenueMetric[];
  createdAt: string;
}

export function createRevenueForecast(input: RevenueForecastInput): RevenueForecast {
  const forecastAmount =
    input.committedRevenue +
    input.bestCaseRevenue * 0.35 +
    input.pipelineCoverage * 0.15;

  const confidence = Math.min(1, Math.max(0, input.historicalAccuracy));

  return {
    id: `forecast-${Date.now()}`,
    timeframe: {
      startDate: new Date().toISOString(),
      endDate: new Date().toISOString(),
    },
    forecastAmount,
    confidence,
    metrics: [
      {
        key: "forecast_amount",
        label: "Forecast Amount",
        value: forecastAmount,
      },
      {
        key: "forecast_confidence",
        label: "Forecast Confidence",
        value: confidence,
        unit: "ratio",
      },
    ],
    createdAt: new Date().toISOString(),
  };
}
