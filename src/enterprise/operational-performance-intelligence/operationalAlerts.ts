import type {
  OperationalAlertSeverity,
  OperationalInsight,
} from "./operationalPerformanceTypes";

export interface OperationalAlert {
  id: string;
  insightId: string;
  severity: OperationalAlertSeverity;
  message: string;
  requiresEscalation: boolean;
}

export function buildOperationalAlerts(
  insights: OperationalInsight[]
): OperationalAlert[] {
  return insights.map((insight) => ({
    id: `${insight.id}-alert`,
    insightId: insight.id,
    severity: insight.severity,
    message: `${insight.title}: ${insight.summary}`,
    requiresEscalation: insight.severity === "urgent" || insight.severity === "high",
  }));
}
