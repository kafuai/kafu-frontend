import { OrganizationHierarchy } from "./organizationHierarchy";

export interface OrganizationHierarchyValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateOrganizationHierarchy(
  hierarchy: OrganizationHierarchy
): OrganizationHierarchyValidationResult {
  const errors: string[] = [];

  if (!hierarchy.rootNodeId) {
    errors.push("Root node is required.");
  }

  const ids = new Set<string>();

  for (const node of hierarchy.nodes) {
    if (ids.has(node.id)) {
      errors.push(`Duplicate node id: ${node.id}`);
    }

    ids.add(node.id);

    if (
      node.parentId &&
      !hierarchy.nodes.some((n) => n.id === node.parentId)
    ) {
      errors.push(
        `Parent node not found: ${node.parentId}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}