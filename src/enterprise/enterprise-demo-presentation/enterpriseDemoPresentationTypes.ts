export type EnterpriseDemoPresentationAudience =
  | "executive"
  | "department-leader"
  | "operations"
  | "technology"
  | "client";

export type EnterpriseDemoPresentationStatus =
  | "draft"
  | "ready"
  | "presenting"
  | "completed"
  | "archived";

export type EnterpriseDemoPresentationSectionType =
  | "opening"
  | "business-context"
  | "problem"
  | "capability"
  | "workflow"
  | "intelligence"
  | "execution"
  | "outcome"
  | "closing";

export type EnterpriseDemoPresentationEmphasis =
  | "standard"
  | "highlight"
  | "critical"
  | "success";

export interface EnterpriseDemoPresentationMetric {
  id: string;
  label: string;
  value: string;
  description?: string | null;
  emphasis: EnterpriseDemoPresentationEmphasis;
}

export interface EnterpriseDemoPresentationSection {
  id: string;
  title: string;
  subtitle?: string | null;
  narrative: string;
  type: EnterpriseDemoPresentationSectionType;
  order: number;
  visible: boolean;
  metrics: EnterpriseDemoPresentationMetric[];
}

export interface EnterpriseDemoPresentation {
  id: string;
  organizationId: string;
  demoRuntimeId: string;
  title: string;
  audience: EnterpriseDemoPresentationAudience;
  status: EnterpriseDemoPresentationStatus;
  sections: EnterpriseDemoPresentationSection[];
  createdAt: string;
  updatedAt: string;
}
