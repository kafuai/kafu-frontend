export type ExecutiveDemoFlowNavigationStatus =
  | "idle"
  | "ready"
  | "in-progress"
  | "completed"
  | "paused"
  | "cancelled";

export type ExecutiveDemoFlowNavigationStepType =
  | "opening"
  | "context"
  | "discovery"
  | "analysis"
  | "decision"
  | "recommendation"
  | "execution"
  | "closing";

export type ExecutiveDemoFlowNavigationDirection =
  | "forward"
  | "backward"
  | "jump";

export interface ExecutiveDemoFlowNavigationRoute {
  id: string;
  path: string;
  label: string;
  description?: string;
}

export interface ExecutiveDemoFlowNavigationStep {
  id: string;
  order: number;
  title: string;
  description: string;
  type: ExecutiveDemoFlowNavigationStepType;
  route: ExecutiveDemoFlowNavigationRoute;
  required: boolean;
  estimatedMinutes?: number;
  executiveMessage?: string;
}

export interface ExecutiveDemoFlowNavigationTransition {
  id: string;
  fromStepId: string;
  toStepId: string;
  direction: ExecutiveDemoFlowNavigationDirection;
  allowed: boolean;
  reason?: string;
}

export interface ExecutiveDemoFlowNavigationProgress {
  currentStepId: string | null;
  currentStepIndex: number;
  completedStepIds: string[];
  remainingStepIds: string[];
  completionPercentage: number;
}

export interface ExecutiveDemoFlowNavigation {
  id: string;
  organizationId: string;
  companyName: string;
  title: string;
  status: ExecutiveDemoFlowNavigationStatus;
  steps: ExecutiveDemoFlowNavigationStep[];
  transitions: ExecutiveDemoFlowNavigationTransition[];
  progress: ExecutiveDemoFlowNavigationProgress;
  createdAt: string;
  updatedAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface ExecutiveDemoFlowNavigationInput {
  organizationId: string;
  companyName: string;
  title?: string;
  steps: ExecutiveDemoFlowNavigationStep[];
}
