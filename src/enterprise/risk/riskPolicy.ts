import { EnterpriseRisk, RiskCategory, RiskSeverity } from "./riskTypes";

export type RiskPolicyAction =
  | "allow"
  | "review"
  | "mitigate"
  | "escalate"
  | "block";

export type RiskPolicyRule = {
  id: string;
  category?: RiskCategory;
  minSeverity?: RiskSeverity;
  action: RiskPolicyAction;
  reason: string;
};

export type RiskPolicy = {
  id: string;
  organizationId: string;
  name: string;
  rules: RiskPolicyRule[];
  active: boolean;
};

const severityRank: Record<RiskSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function evaluateRiskPolicy(
  policy: RiskPolicy,
  risk: EnterpriseRisk,
): RiskPolicyAction {
  if (!policy.active) {
    return "allow";
  }

  const matchedRule = policy.rules.find((rule) => {
    const categoryMatches = !rule.category || rule.category === risk.category;
    const severityMatches =
      !rule.minSeverity ||
      severityRank[risk.severity] >= severityRank[rule.minSeverity];

    return categoryMatches && severityMatches;
  });

  return matchedRule?.action ?? "allow";
}