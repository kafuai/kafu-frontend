export interface ProcurementComplianceCheck {
  id: string;
  targetId: string;
  rule: string;
  compliant: boolean;
  findings: string[];
  checkedAt: string;
}