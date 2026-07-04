import { CrisisSeverity } from "./crisisTypes";

export type CrisisEscalationLevel =
  | "operational"
  | "management"
  | "executive"
  | "board";

export type CrisisEscalationRule = {
  id: string;
  organizationId: string;
  name: string;
  minSeverity: CrisisSeverity;
  impactScoreThreshold: number;
  escalateTo: CrisisEscalationLevel;
  notifyRoles: string[];
  active: boolean;
};

const severityRank: Record<CrisisSeverity, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

export function shouldEscalateCrisis(
  severity: CrisisSeverity,
  impactScore: number,
  rule: CrisisEscalationRule,
): boolean {
  return (
    rule.active &&
    severityRank[severity] >= severityRank[rule.minSeverity] &&
    impactScore >= rule.impactScoreThreshold
  );
}