import { OrganizationDiscoveryResult } from "./organizationDiscoveryResult";

export function calculateDiscoveryCoverage(
  result: OrganizationDiscoveryResult
): number {
  const total = result.hierarchy.nodes.length;

  if (total === 0) {
    return 0;
  }

  const active = result.hierarchy.nodes.filter(
    (node) => node.status === "active"
  ).length;

  return active / total;
}