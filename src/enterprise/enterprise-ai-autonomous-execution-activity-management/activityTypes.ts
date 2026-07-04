export type ActivityStatus =
  | "planned"
  | "ready"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled";

export type ActivityPriority = "low" | "medium" | "high" | "critical";

export type ActivityRiskLevel = "none" | "low" | "medium" | "high" | "critical";

export interface EnterpriseExecutionActivity {
  id: string;
  taskId: string;
  title: string;
  description: string;
  owner: string;
  status: ActivityStatus;
  priority: ActivityPriority;
  progress: number;
  riskLevel: ActivityRiskLevel;
  dependencies: string[];
  blockers: string[];
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
}

export interface ActivityReadinessSignal {
  activityId: string;
  isReady: boolean;
  missingDependencies: string[];
  activeBlockers: string[];
  readinessScore: number;
  recommendation: string;
}

export interface ActivityExecutionSummary {
  totalActivities: number;
  planned: number;
  ready: number;
  inProgress: number;
  blocked: number;
  completed: number;
  cancelled: number;
  averageProgress: number;
  highestRiskLevel: ActivityRiskLevel;
}