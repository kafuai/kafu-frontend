import {
  EnterpriseRisk,
  RiskSeverity,
  RiskStatus,
} from "./riskTypes";

export type RiskEventType =
  | "risk_identified"
  | "risk_assessed"
  | "risk_score_changed"
  | "risk_policy_triggered"
  | "risk_mitigation_started"
  | "risk_mitigation_completed"
  | "risk_threshold_breached"
  | "risk_status_changed"
  | "risk_closed";

export type RiskEvent = {
  id: string;
  organizationId: string;
  riskId: string;
  type: RiskEventType;
  severity: RiskSeverity;
  status: RiskStatus;
  message: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
};

export function createRiskEvent(
  risk: EnterpriseRisk,
  type: RiskEventType,
  message: string,
  metadata?: Record<string, string | number | boolean>,
): RiskEvent {
  return {
    id: `${risk.id}-${type}-${Date.now()}`,
    organizationId: risk.organizationId,
    riskId: risk.id,
    type,
    severity: risk.severity,
    status: risk.status,
    message,
    occurredAt: new Date().toISOString(),
    metadata,
  };
}