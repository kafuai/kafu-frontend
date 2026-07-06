export type OrganizationDocumentType =
  | "policy"
  | "procedure"
  | "handbook"
  | "contract"
  | "job_description"
  | "organizational_chart"
  | "form"
  | "template"
  | "manual"
  | "knowledge_base"
  | "other";

export type OrganizationDocumentStatus =
  | "draft"
  | "uploaded"
  | "processing"
  | "indexed"
  | "active"
  | "archived";

export type KnowledgeExtractionStatus =
  | "pending"
  | "running"
  | "completed"
  | "failed";

export interface OrganizationDocument {
  readonly id: string;
  readonly tenantId: string;
  readonly name: string;
  readonly type: OrganizationDocumentType;
  readonly version: string;
  readonly status: OrganizationDocumentStatus;
  readonly uploadedAt: string;
  readonly uploadedBy: string;
  readonly tags: readonly string[];
}

export interface KnowledgeExtractionJob {
  readonly id: string;
  readonly documentId: string;
  readonly status: KnowledgeExtractionStatus;
  readonly startedAt?: string;
  readonly completedAt?: string;
  readonly extractedEntities: number;
}