export type ExecutiveForecastTrend = "up" | "down" | "stable";

export interface ExecutiveForecastPeriod {
  startDate: Date;
  endDate: Date;
  label: string;
}

export interface ExecutiveForecast {
  predictedRevenue: number;
  committedRevenue: number;
  weightedRevenue: number;
  confidence: number;
  trend: ExecutiveForecastTrend;
  period: ExecutiveForecastPeriod;
}
