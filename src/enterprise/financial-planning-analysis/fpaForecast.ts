import type { FPAAmount, FPAPeriod, FPAStatus } from "./fpaTypes";

export interface FPAForecastInput {
  id: string;
  source: string;
  driver: string;
  assumption: string;
  amount: FPAAmount;
  confidence: number;
}

export interface FPAForecast {
  id: string;
  period: FPAPeriod;
  fiscalYear: number;
  inputs: FPAForecastInput[];
  status: FPAStatus;
  owner: string;
}

export function calculateForecastValue(forecast: FPAForecast): number {
  return forecast.inputs.reduce((total, input) => total + input.amount.value, 0);
}

export function calculateForecastConfidence(forecast: FPAForecast): number {
  if (forecast.inputs.length === 0) return 0;
  return Number((forecast.inputs.reduce((sum, input) => sum + input.confidence, 0) / forecast.inputs.length).toFixed(2));
}
