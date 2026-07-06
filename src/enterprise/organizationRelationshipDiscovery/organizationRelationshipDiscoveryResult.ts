import { OrganizationRelationshipGraph } from "./organizationRelationshipGraph";

export interface OrganizationRelationshipDiscoveryResult {
  organizationId: string;
  discoveredAt: string;
  graph: OrganizationRelationshipGraph;
  confidence: number;
  findings: string[];
}