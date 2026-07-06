import { OrganizationHierarchy } from "./organizationHierarchy";

export interface OrganizationDiscoveryResult {
  organizationId: string;
  discoveredAt: string;
  hierarchy: OrganizationHierarchy;
  confidence: number;
  issues: string[];
}