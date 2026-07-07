import { FinancialAmount } from "./financialManagementTypes";

export interface FinancialROI {
  investmentId: string;
  investment: FinancialAmount;
  returnValue: FinancialAmount;
  roiPercentage: number;
  paybackPeriodMonths: number;
}