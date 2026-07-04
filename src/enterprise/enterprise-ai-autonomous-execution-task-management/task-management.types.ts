export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type TaskStatus =
  | 'draft'
  | 'ready'
  | 'blocked'
  | 'in_progress'
  | 'under_review'
  | 'completed'
  | 'cancelled';

export type TaskRiskLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';

export type TaskDependencyType =
  | 'blocking'
  | 'informational'
  | 'approval'
  | 'resource'
  | 'sequence';

export type TaskExecutionMode =
  | 'manual'
  | 'assisted'
  | 'semi_autonomous'
  | 'autonomous';

export type TaskValidationState =
  | 'not_required'
  | 'pending'
  | 'passed'
  | 'failed';

export type TaskOwnerType = 'human' | 'team' | 'agent' | 'system';

export interface TaskDependency {
  dependencyId: string;
  dependencyType: TaskDependencyType;
  reason: string;
  isResolved: boolean;
}

export interface TaskOwner {
  ownerId: string;
  ownerType: TaskOwnerType;
  displayName: string;
}

export interface TaskEffortEstimate {
  estimatedHours: number;
  confidence: number;
}

export interface TaskExecutionSignal {
  signalId: string;
  label: string;
  value: number;
  weight: number;
}

export interface TaskQualityGate {
  gateId: string;
  name: string;
  validationState: TaskValidationState;
  required: boolean;
  notes?: string;
}