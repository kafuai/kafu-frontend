export type EnterpriseMemoryScope =
  | "tenant"
  | "organization"
  | "department"
  | "team"
  | "user"
  | "conversation"
  | "workflow";

export type EnterpriseMemoryCategory =
  | "preference"
  | "decision"
  | "fact"
  | "context"
  | "instruction"
  | "behavior"
  | "relationship"
  | "risk"
  | "task"
  | "knowledge";

export type EnterpriseMemoryStatus =
  | "active"
  | "archived"
  | "expired"
  | "superseded"
  | "blocked";

export type EnterpriseMemorySensitivity =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export type EnterpriseMemoryConfidence =
  | "low"
  | "medium"
  | "high"
  | "verified";

export interface EnterpriseMemorySource {
  readonly sourceId: string;
  readonly sourceType:
    | "conversation"
    | "document"
    | "user_action"
    | "system_event"
    | "workflow"
    | "manual";
  readonly capturedAt: string;
  readonly capturedBy: string;
}

export interface EnterpriseMemoryRetentionPolicy {
  readonly expiresAt?: string;
  readonly reviewAfter?: string;
  readonly allowLearning: boolean;
  readonly allowPersonalization: boolean;
  readonly allowReasoningReuse: boolean;
}

export interface EnterpriseMemorySecurityPolicy {
  readonly sensitivity: EnterpriseMemorySensitivity;
  readonly accessRoles: readonly string[];
  readonly tenantIsolated: boolean;
  readonly auditRequired: boolean;
}

export interface EnterpriseMemoryMetadata {
  readonly tenantId: string;
  readonly organizationId?: string;
  readonly userId?: string;
  readonly conversationId?: string;
  readonly departmentId?: string;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly version: number;
}

export interface EnterpriseMemoryPayload {
  readonly title: string;
  readonly content: string;
  readonly summary?: string;
  readonly keywords: readonly string[];
  readonly relatedEntityIds: readonly string[];
}

export interface EnterpriseMemoryRecord {
  readonly id: string;
  readonly scope: EnterpriseMemoryScope;
  readonly category: EnterpriseMemoryCategory;
  readonly status: EnterpriseMemoryStatus;
  readonly confidence: EnterpriseMemoryConfidence;
  readonly source: EnterpriseMemorySource;
  readonly payload: EnterpriseMemoryPayload;
  readonly metadata: EnterpriseMemoryMetadata;
  readonly retention: EnterpriseMemoryRetentionPolicy;
  readonly security: EnterpriseMemorySecurityPolicy;
}