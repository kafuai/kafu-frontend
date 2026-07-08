import type { TreasuryCurrency, TreasuryStatus, TreasuryAuditTrail } from "./treasuryManagementTypes";

export interface TreasuryCashFlowForecastLine {
  id: string;
  category: "customer_receipt" | "supplier_payment" | "payroll" | "tax" | "debt_service" | "investment" | "other";
  expectedDate: string;
  amount: number;
  currency: TreasuryCurrency;
  probability: number;
  description?: string;
}

export interface TreasuryCashFlowForecast {
  id: string;
  entityId: string;
  forecastStartDate: string;
  forecastEndDate: string;
  lines: TreasuryCashFlowForecastLine[];
  expectedInflows: number;
  expectedOutflows: number;
  netForecastCashFlow: number;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export function createTreasuryCashFlowForecast(input: {
  id: string;
  entityId: string;
  forecastStartDate: string;
  forecastEndDate: string;
  lines: TreasuryCashFlowForecastLine[];
  createdBy: string;
}): TreasuryCashFlowForecast {
  const expectedInflows = input.lines
    .filter((line) => line.amount > 0)
    .reduce((sum, line) => sum + line.amount * line.probability, 0);

  const expectedOutflows = Math.abs(
    input.lines
      .filter((line) => line.amount < 0)
      .reduce((sum, line) => sum + line.amount * line.probability, 0)
  );

  return {
    id: input.id,
    entityId: input.entityId,
    forecastStartDate: input.forecastStartDate,
    forecastEndDate: input.forecastEndDate,
    lines: input.lines,
    expectedInflows,
    expectedOutflows,
    netForecastCashFlow: expectedInflows - expectedOutflows,
    status: "active",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function getForecastCoverageDays(forecast: TreasuryCashFlowForecast): number {
  const start = new Date(forecast.forecastStartDate).getTime();
  const end = new Date(forecast.forecastEndDate).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) return 0;

  return Math.ceil((end - start) / 86_400_000);
}
