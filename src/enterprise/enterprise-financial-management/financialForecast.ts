import {
  FinancialAmount,
  FinancialPeriod,
} from "./financialManagementTypes";

export interface FinancialForecast {
  id: string;
  period: FinancialPeriod;
  expectedRevenue: FinancialAmount;
  expectedExpense: FinancialAmount;
  projectedProfit: FinancialAmount;
  confidence: number;
}