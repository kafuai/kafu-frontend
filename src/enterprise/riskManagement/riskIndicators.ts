export interface EnterpriseRiskIndicator {
  indicatorId: string;
  riskId: string;
  name: string;
  description?: string;
  currentValue: number;
  targetValue: number;
  unit?: string;
  measuredAt: string;
}