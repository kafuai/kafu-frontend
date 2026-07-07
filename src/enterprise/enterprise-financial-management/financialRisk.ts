import { FinancialPriority } from "./financialManagementTypes";

export interface FinancialRisk {
  id: string;
  title: string;
  description: string;
  severity: FinancialPriority;
  probability: number;
  impact: number;
  mitigationPlan?: string;
}