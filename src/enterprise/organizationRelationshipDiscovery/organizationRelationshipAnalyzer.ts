import { OrganizationRelationshipDiscoveryResult } from "./organizationRelationshipDiscoveryResult";

export function calculateRelationshipCoverage(
  result: OrganizationRelationshipDiscoveryResult
): number {
  const total = result.graph.relationships.length;

  if (total === 0) {
    return 0;
  }

  const active = result.graph.relationships.filter(
    (relationship) => relationship.status === "active"
  ).length;

  return active / total;
}