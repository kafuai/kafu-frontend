import { OrganizationRelationshipGraph } from "./organizationRelationshipGraph";

export interface OrganizationRelationshipValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOrganizationRelationshipGraph(
  graph: OrganizationRelationshipGraph
): OrganizationRelationshipValidationResult {
  const errors: string[] = [];

  const ids = new Set<string>();

  for (const relationship of graph.relationships) {
    if (ids.has(relationship.id)) {
      errors.push(`Duplicate relationship id: ${relationship.id}`);
    }

    ids.add(relationship.id);

    if (relationship.sourceNodeId === relationship.targetNodeId) {
      errors.push(
        `Relationship ${relationship.id} references the same node.`
      );
    }

    if (relationship.confidence < 0 || relationship.confidence > 1) {
      errors.push(
        `Relationship ${relationship.id} has invalid confidence.`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}