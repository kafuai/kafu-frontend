export interface WorkforceForecast {
  period: string;
  expectedDemand: number;
  expectedSupply: number;
}

export function calculateForecastGap(
  forecast: WorkforceForecast
): number {
  return Math.max(
    forecast.expectedDemand -
      forecast.expectedSupply,
    0
  );
}

export function requiresHiring(
  forecast: WorkforceForecast
): boolean {
  return calculateForecastGap(forecast) > 0;
}
