import {
  TaskDependency,
  TaskEffortEstimate,
  TaskExecutionMode,
  TaskExecutionSignal,
  TaskOwner,
  TaskPriority,
  TaskQualityGate,
  TaskRiskLevel,
  TaskStatus,
} from './task-management.types';

export interface EnterpriseExecutionTask {
  id: string;
  workstreamId: string;
  initiativeId: string;
  programId: string;
  portfolioId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  riskLevel: TaskRiskLevel;
  executionMode: TaskExecutionMode;
  owner: TaskOwner;
  dependencies: TaskDependency[];
  effortEstimate: TaskEffortEstimate;
  executionSignals: TaskExecutionSignal[];
  qualityGates: TaskQualityGate[];
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
}

export interface TaskReadinessAssessment {
  taskId: string;
  isReady: boolean;
  readinessScore: number;
  blockers: string[];
  recommendations: string[];
}

export interface TaskExecutionAssessment {
  taskId: string;
  executionScore: number;
  riskScore: number;
  qualityScore: number;
  deliveryConfidence: number;
  recommendedStatus: TaskStatus;
}

export interface TaskManagementSummary {
  totalTasks: number;
  readyTasks: number;
  blockedTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  criticalTasks: number;
  averageReadinessScore: number;
  averageDeliveryConfidence: number;
}