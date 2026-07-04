export type WorkstreamStatus =
  | 'planned'
  | 'active'
  | 'blocked'
  | 'at_risk'
  | 'completed'
  | 'paused';

export type WorkstreamPriority = 'low' | 'medium' | 'high' | 'critical';

export type WorkstreamHealth = 'healthy' | 'watch' | 'risk' | 'critical';

export interface WorkstreamDependency {
  id: string;
  workstreamId: string;
  dependsOnWorkstreamId: string;
  reason: string;
  blocking: boolean;
}

export interface WorkstreamRisk {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  likelihood: 'low' | 'medium' | 'high';
  mitigation: string;
  owner?: string;
}

export interface WorkstreamMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completionDate?: string;
}

export interface ExecutionWorkstream {
  id: string;
  initiativeId: string;
  name: string;
  description: string;
  owner: string;
  status: WorkstreamStatus;
  priority: WorkstreamPriority;
  health: WorkstreamHealth;
  progressPercent: number;
  startDate: string;
  targetDate: string;
  dependencies: WorkstreamDependency[];
  risks: WorkstreamRisk[];
  milestones: WorkstreamMilestone[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkstreamCreateInput {
  initiativeId: string;
  name: string;
  description: string;
  owner: string;
  priority: WorkstreamPriority;
  startDate: string;
  targetDate: string;
}

export interface WorkstreamUpdateInput {
  name?: string;
  description?: string;
  owner?: string;
  status?: WorkstreamStatus;
  priority?: WorkstreamPriority;
  health?: WorkstreamHealth;
  progressPercent?: number;
  targetDate?: string;
}