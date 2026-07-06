import { OrganizationRelationshipDiscoveryResult } from "./organizationRelationshipDiscoveryResult";
import { validateOrganizationRelationshipGraph } from "./organizationRelationshipValidator";
import { calculateRelationshipCoverage } from "./organizationRelationshipAnalyzer";

export interface OrganizationRelationshipDiscoverySummary {
  organizationId: string;
  discoveredAt: string;
  relationshipCount: number;
  confidence: number;
  coverage: number;
  valid: boolean;
  findings: string[];
}

export function summarizeOrganizationRelationshipDiscovery(
  result: OrganizationRelationshipDiscoveryResult
): OrganizationRelationshipDiscoverySummary {
  const validation = validateOrganizationRelationshipGraph(result.graph);
  const coverage = calculateRelationshipCoverage(result);

  return {
    organizationId: result.organizationId,
    discoveredAt: result.discoveredAt,
    relationshipCount: result.graph.relationships.length,
    confidence: result.confidence,
    coverage,
    valid: validation.valid,
    findings: [...result.findings, ...validation.errors],
  };
}