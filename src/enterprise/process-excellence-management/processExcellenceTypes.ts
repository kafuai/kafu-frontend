export type ProcessCriticality = "low" | "medium" | "high" | "mission_critical";

export type ProcessMaturityLevel =
  | "initial"
  | "managed"
  | "standardized"
  | "optimized"
  | "adaptive";

export type ProcessHealthStatus =
  | "healthy"
  | "watch"
  | "at_risk"
  | "critical";

export type ImprovementPriority = "low" | "medium" | "high" | "urgent";

export interface EnterpriseProcess {
  id: string;
  name: string;
  owner: string;
  domain: string;
  criticality: ProcessCriticality;
  maturity: ProcessMaturityLevel;
  status: ProcessHealthStatus;
  automationCoverage: number;
  cycleTimeHours: number;
  defectRate: number;
}

export interface ProcessImprovementOpportunity {
  id: string;
  processId: string;
  title: string;
  priority: ImprovementPriority;
  expectedImpact: string;
  estimatedEffort: string;
  targetMetric: string;
}

export interface ProcessRiskSignal {
  id: string;
  processId: string;
  risk: string;
  severity: ImprovementPriority;
  mitigation: string;
}

export interface ProcessExcellenceSummary {
  totalProcesses: number;
  criticalProcesses: number;
  averageAutomationCoverage: number;
  averageCycleTimeHours: number;
  highPriorityImprovements: number;
  criticalRisks: number;
}
