export type OrganizationRelationshipType =
  | "reports_to"
  | "collaborates_with"
  | "supports"
  | "governs"
  | "depends_on"
  | "shares_resources"
  | "owns"
  | "manages";

export type OrganizationRelationshipStatus =
  | "proposed"
  | "active"
  | "inactive"
  | "archived";

export interface OrganizationRelationship {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  type: OrganizationRelationshipType;
  status: OrganizationRelationshipStatus;
  confidence: number;
  discoveredAt: string;
}