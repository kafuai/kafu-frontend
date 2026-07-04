export type ProgramExecutionStatus =
  | "planned"
  | "active"
  | "at-risk"
  | "blocked"
  | "completed";

export type ProgramStrategicPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type ProgramDependencyStatus =
  | "healthy"
  | "delayed"
  | "blocked"
  | "unknown";

export type ProgramRiskLevel =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ProgramObjective {
  id: string;
  title: string;
  description: string;
  expectedOutcome: string;
  priority: ProgramStrategicPriority;
}

export interface ProgramMilestone {
  id: string;
  title: string;
  targetDate: string;
  status: ProgramExecutionStatus;
  completionPercentage: number;
}

export interface ProgramDependency {
  id: string;
  sourceProgramId: string;
  targetProgramId: string;
  description: string;
  status: ProgramDependencyStatus;
  impactLevel: ProgramRiskLevel;
}

export interface ProgramRisk {
  id: string;
  title: string;
  description: string;
  likelihood: ProgramRiskLevel;
  impact: ProgramRiskLevel;
  mitigationPlan: string;
}

export interface ProgramDefinition {
  id: string;
  name: string;
  description: string;
  owner: string;
  portfolioId: string;
  status: ProgramExecutionStatus;
  strategicPriority: ProgramStrategicPriority;
  objectives: ProgramObjective[];
  milestones: ProgramMilestone[];
  dependencies: ProgramDependency[];
  risks: ProgramRisk[];
}

export interface ProgramHealthAssessment {
  programId: string;
  healthScore: number;
  status: ProgramExecutionStatus;
  blockers: string[];
  warnings: string[];
  recommendations: string[];
}

export interface ProgramPriorityAssessment {
  programId: string;
  priorityScore: number;
  priority: ProgramStrategicPriority;
  rationale: string[];
}

export interface ProgramReadinessPlan {
  programId: string;
  readinessScore: number;
  readyToExecute: boolean;
  requiredActions: string[];
  recommendedSequence: string[];
}