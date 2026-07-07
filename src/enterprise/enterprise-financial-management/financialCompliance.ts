export interface FinancialComplianceCheck {
  id: string;
  targetId: string;
  rule: string;
  compliant: boolean;
  findings: string[];
  checkedAt: string;
}