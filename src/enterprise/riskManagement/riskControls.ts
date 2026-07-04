export type EnterpriseRiskControlType =
  | "preventive"
  | "detective"
  | "corrective"
  | "compensating";

export type EnterpriseRiskControlStatus =
  | "planned"
  | "active"
  | "ineffective"
  | "retired";

export interface EnterpriseRiskControl {
  controlId: string;
  riskId: string;
  name: string;
  description: string;
  type: EnterpriseRiskControlType;
  status: EnterpriseRiskControlStatus;
  ownerId: string;
  effectivenessScore: number;
  createdAt: string;
  updatedAt: string;
}