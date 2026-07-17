export type ExecutiveDemoFinalIntegrationStatus =
  | "draft"
  | "assembling"
  | "ready"
  | "validated"
  | "released"
  | "blocked";

export type ExecutiveDemoFinalIntegrationComponentType =
  | "operational-readiness"
  | "decision-briefing"
  | "flow-navigation"
  | "presentation"
  | "orchestration"
  | "experience";

export type ExecutiveDemoFinalIntegrationHealth =
  | "healthy"
  | "warning"
  | "critical"
  | "unknown";

export interface ExecutiveDemoFinalIntegrationComponent {
  id: string;
  name: string;
  type: ExecutiveDemoFinalIntegrationComponentType;
  version: string;
  enabled: boolean;
  required: boolean;
  health: ExecutiveDemoFinalIntegrationHealth;
  description?: string;
  dependencies?: string[];
}

export interface ExecutiveDemoFinalIntegrationIssue {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low";
  componentId?: string;
  resolved: boolean;
}

export interface ExecutiveDemoFinalIntegrationCheckpoint {
  id: string;
  title: string;
  description: string;
  passed: boolean;
  required: boolean;
  checkedAt?: string;
}

export interface ExecutiveDemoFinalIntegrationReadiness {
  totalComponents: number;
  healthyComponents: number;
  requiredComponentsReady: number;
  requiredComponentsTotal: number;
  unresolvedIssues: number;
  passedCheckpoints: number;
  totalCheckpoints: number;
  readinessPercentage: number;
  releaseReady: boolean;
}

export interface ExecutiveDemoFinalIntegration {
  id: string;
  organizationId: string;
  companyName: string;
  title: string;
  status: ExecutiveDemoFinalIntegrationStatus;
  components: ExecutiveDemoFinalIntegrationComponent[];
  issues: ExecutiveDemoFinalIntegrationIssue[];
  checkpoints: ExecutiveDemoFinalIntegrationCheckpoint[];
  readiness: ExecutiveDemoFinalIntegrationReadiness;
  createdAt: string;
  updatedAt: string;
  validatedAt?: string;
  releasedAt?: string;
}

export interface ExecutiveDemoFinalIntegrationInput {
  organizationId: string;
  companyName: string;
  title?: string;
  components: ExecutiveDemoFinalIntegrationComponent[];
  issues?: ExecutiveDemoFinalIntegrationIssue[];
  checkpoints?: ExecutiveDemoFinalIntegrationCheckpoint[];
}
