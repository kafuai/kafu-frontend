export type ContextSourceType =
  | "user"
  | "organization"
  | "department"
  | "role"
  | "policy"
  | "document"
  | "workflow"
  | "conversation"
  | "system";

export type ContextPriority = "low" | "medium" | "high" | "critical";

export type ContextFreshness = "real_time" | "recent" | "stable" | "stale";

export interface ContextMetadata {
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  source: ContextSourceType;
  priority: ContextPriority;
  freshness: ContextFreshness;
  tags: string[];
}

export interface EnterpriseContext {
  id: string;
  name: string;
  description: string;
  metadata: ContextMetadata;
}