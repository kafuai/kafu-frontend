import { RiskCategory, RiskSeverity } from "./riskTypes";

export type RiskControlType =
  | "preventive"
  | "detective"
  | "corrective"
  | "compensating";

export type RiskControlEffectiveness =
  | "weak"
  | "moderate"
  | "strong";

export type RiskControl = {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: RiskCategory;
  type: RiskControlType;
  effectiveness: RiskControlEffectiveness;
  ownerId: string;
  active: boolean;
};

export function isControlEffective(
  control: RiskControl,
  minimum: RiskControlEffectiveness = "moderate",
): boolean {
  const rank: Record<RiskControlEffectiveness, number> = {
    weak: 1,
    moderate: 2,
    strong: 3,
  };

  return control.active && rank[control.effectiveness] >= rank[minimum];
}

export function requiresStrongControl(severity: RiskSeverity): boolean {
  return severity === "high" || severity === "critical";
}