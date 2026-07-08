export type LearningStatus =
  | "draft"
  | "active"
  | "completed"
  | "archived";

export type LearningLevel =
  | "beginner"
  | "intermediate"
  | "advanced"
  | "expert";

export interface LearningProfile {
  id: string;
  organizationId: string;
  status: LearningStatus;
  level: LearningLevel;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface LearningMetric {
  name: string;
  value: number;
  measuredAt: string;
}
