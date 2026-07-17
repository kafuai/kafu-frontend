export type ExecutiveOperationalReadinessLevel =
  | "critical"
  | "low"
  | "moderate"
  | "high"
  | "excellent";

export interface ExecutiveOperationalReadinessInput {
  organizationId: string;
  readinessScore: number;
  governanceScore: number;
  executionScore: number;
  intelligenceScore: number;
}

export interface ExecutiveOperationalReadinessResult {
  overallScore: number;
  readinessLevel: ExecutiveOperationalReadinessLevel;
  strengths: string[];
  risks: string[];
  recommendations: string[];
}