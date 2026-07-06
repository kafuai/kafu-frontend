import { OrganizationDiscoveryResult } from "./organizationDiscoveryResult";
import { validateOrganizationHierarchy } from "./organizationHierarchyValidator";
import { calculateDiscoveryCoverage } from "./organizationDiscoveryAnalyzer";

export interface OrganizationStructureDiscoverySummary {
  organizationId: string;
  discoveredAt: string;
  nodeCount: number;
  confidence: number;
  coverage: number;
  valid: boolean;
  issues: string[];
}

export function summarizeOrganizationStructureDiscovery(
  result: OrganizationDiscoveryResult
): OrganizationStructureDiscoverySummary {
  const validation = validateOrganizationHierarchy(result.hierarchy);
  const coverage = calculateDiscoveryCoverage(result);

  return {
    organizationId: result.organizationId,
    discoveredAt: result.discoveredAt,
    nodeCount: result.hierarchy.nodes.length,
    confidence: result.confidence,
    coverage,
    valid: validation.valid,
    issues: [...result.issues, ...validation.errors],
  };
}