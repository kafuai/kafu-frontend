export type SecurityLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ComplianceStatus =
  | "compliant"
  | "warning"
  | "non_compliant";

export interface SecurityFinding {
  id: string;
  title: string;
  level: SecurityLevel;
}

export interface SecurityPolicyModel {
  id: string;
  name: string;
  enabled: boolean;
}

export interface EnterpriseSecurityModel {
  score: number;
  compliance: ComplianceStatus;
  findings: SecurityFinding[];
  policies: SecurityPolicyModel[];
}
