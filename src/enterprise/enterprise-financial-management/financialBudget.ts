import {
  FinancialAmount,
  FinancialOwner,
  FinancialPeriod,
  FinancialStatus,
} from "./financialManagementTypes";

export interface FinancialBudget {
  id: string;
  name: string;
  owner: FinancialOwner;
  period: FinancialPeriod;
  allocated: FinancialAmount;
  consumed: FinancialAmount;
  remaining: FinancialAmount;
  status: FinancialStatus;
}