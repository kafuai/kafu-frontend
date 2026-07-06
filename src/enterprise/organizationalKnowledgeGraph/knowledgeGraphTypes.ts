export type KnowledgeGraphNodeType =
  | "company"
  | "department"
  | "position"
  | "employee"
  | "policy"
  | "document"
  | "process"
  | "capability"
  | "relationship"
  | "knowledge_asset";

export type KnowledgeGraphRelationType =
  | "owns"
  | "belongs_to"
  | "reports_to"
  | "manages"
  | "governs"
  | "references"
  | "depends_on"
  | "supports"
  | "describes"
  | "influences"
  | "requires"
  | "connected_to";

export type KnowledgeGraphConfidence =
  | "low"
  | "medium"
  | "high"
  | "verified";

export type KnowledgeGraphVisibility =
  | "public"
  | "internal"
  | "confidential"
  | "restricted";

export interface KnowledgeGraphMetadata {
  readonly tenantId: string;
  readonly sourceModule: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly confidence: KnowledgeGraphConfidence;
  readonly visibility: KnowledgeGraphVisibility;
  readonly tags: readonly string[];
}