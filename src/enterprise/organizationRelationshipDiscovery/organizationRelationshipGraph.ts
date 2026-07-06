import { OrganizationRelationship } from "./organizationRelationshipTypes";

export interface OrganizationRelationshipGraph {
  organizationId: string;
  relationships: OrganizationRelationship[];
}

export function getOutgoingRelationships(
  graph: OrganizationRelationshipGraph,
  sourceNodeId: string
): OrganizationRelationship[] {
  return graph.relationships.filter(
    (relationship) => relationship.sourceNodeId === sourceNodeId
  );
}

export function getIncomingRelationships(
  graph: OrganizationRelationshipGraph,
  targetNodeId: string
): OrganizationRelationship[] {
  return graph.relationships.filter(
    (relationship) => relationship.targetNodeId === targetNodeId
  );
}