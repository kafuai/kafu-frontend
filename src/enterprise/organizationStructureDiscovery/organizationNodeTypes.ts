export type OrganizationNodeType =
  | "organization"
  | "division"
  | "business_unit"
  | "sector"
  | "department"
  | "team"
  | "office"
  | "branch"
  | "facility"
  | "cost_center";

export type OrganizationNodeStatus =
  | "draft"
  | "active"
  | "inactive"
  | "archived";

export interface OrganizationNodeMetadata {
  ownerId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

export interface OrganizationNode {
  id: string;
  code: string;
  name: string;
  description?: string;
  type: OrganizationNodeType;
  parentId?: string;
  level: number;
  status: OrganizationNodeStatus;
  metadata: OrganizationNodeMetadata;
}