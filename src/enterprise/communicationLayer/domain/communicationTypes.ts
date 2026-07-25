export type CommunicationId = string;
export type CommunicationTimestamp = string;

export type CommunicationMetadataPrimitive =
  | string
  | number
  | boolean
  | null;

export interface CommunicationMetadataObject {
  readonly [key: string]: CommunicationMetadataValue;
}

export interface CommunicationMetadataArray
  extends ReadonlyArray<CommunicationMetadataValue> {}

export type CommunicationMetadataValue =
  | CommunicationMetadataPrimitive
  | CommunicationMetadataObject
  | CommunicationMetadataArray;

export type CommunicationAttributes = CommunicationMetadataObject;

export interface CommunicationTenantScope {
  readonly companyId: string;
  readonly tenantId: string;
  readonly organizationId: string;
}

export interface CommunicationAuditMetadata {
  readonly createdAt: CommunicationTimestamp;
  readonly updatedAt: CommunicationTimestamp;
  readonly createdBy: CommunicationId;
  readonly updatedBy?: CommunicationId;
}

export interface CommunicationDomainMetadata
  extends CommunicationTenantScope,
    CommunicationAuditMetadata {
  readonly tags: readonly string[];
  readonly attributes?: CommunicationAttributes;
}

export type CommunicationDirection =
  | "inbound"
  | "outbound"
  | "internal";

export type CommunicationPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export type CommunicationLifecycleStatus =
  | "active"
  | "paused"
  | "resolved"
  | "completed"
  | "archived"
  | "failed";

export type CommunicationDeliveryStatus =
  | "draft"
  | "pending"
  | "queued"
  | "sending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
  | "cancelled";

export type CommunicationMessageType =
  | "text"
  | "voice"
  | "image"
  | "document"
  | "file"
  | "system"
  | "event";

export type CommunicationParticipantType =
  | "user"
  | "customer"
  | "employee"
  | "ai"
  | "ai_agent"
  | "corporate_brain"
  | "system"
  | "external";

export type CommunicationParticipantRole =
  | "owner"
  | "member"
  | "observer"
  | "assistant"
  | "agent"
  | "customer"
  | "system";

export type CommunicationConversationType =
  | "corporate_brain"
  | "employee"
  | "team"
  | "customer"
  | "sales"
  | "support"
  | "ai"
  | "system";

export function isCommunicationId(value: string): boolean {
  return value.trim().length > 0;
}

export function normalizeCommunicationTags(
  tags: readonly string[] = [],
): readonly string[] {
  return [
    ...new Set(
      tags
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

export function assertCommunicationTenantScope(
  scope: CommunicationTenantScope,
): void {
  if (!isCommunicationId(scope.companyId)) {
    throw new Error("Communication companyId is required.");
  }

  if (!isCommunicationId(scope.tenantId)) {
    throw new Error("Communication tenantId is required.");
  }

  if (!isCommunicationId(scope.organizationId)) {
    throw new Error("Communication organizationId is required.");
  }
}
