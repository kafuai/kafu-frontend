export type CustomerFeedbackCategory =
  | "product"
  | "support"
  | "onboarding"
  | "performance"
  | "commercial"
  | "other";

export type CustomerFeedbackPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type CustomerFeedbackStatus =
  | "new"
  | "reviewing"
  | "planned"
  | "resolved"
  | "closed";

export interface CustomerFeedbackRecord {
  id: string;
  organizationId: string;
  customerName: string;
  category: CustomerFeedbackCategory;
  priority: CustomerFeedbackPriority;
  status: CustomerFeedbackStatus;
  summary: string;
  details?: string;
  owner?: string;
  submittedAt?: string;
  resolvedAt?: string;
}
