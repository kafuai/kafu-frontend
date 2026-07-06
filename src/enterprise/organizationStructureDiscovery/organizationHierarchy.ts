import { OrganizationNode } from "./organizationNodeTypes";

export interface OrganizationHierarchy {
  rootNodeId: string;
  nodes: OrganizationNode[];
}

export function getRootNode(
  hierarchy: OrganizationHierarchy
): OrganizationNode | undefined {
  return hierarchy.nodes.find(
    (node) => node.id === hierarchy.rootNodeId
  );
}

export function getChildren(
  hierarchy: OrganizationHierarchy,
  parentId: string
): OrganizationNode[] {
  return hierarchy.nodes.filter(
    (node) => node.parentId === parentId
  );
}