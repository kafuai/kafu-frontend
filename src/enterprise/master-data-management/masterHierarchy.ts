import type { MasterDataAuditMetadata } from "./masterDataManagementTypes";

export interface MasterHierarchyNode {
  id: string;
  parentId?: string;
  entityId: string;
  name: string;
}

export interface MasterHierarchy extends MasterDataAuditMetadata {
  id: string;
  name: string;
  nodes: MasterHierarchyNode[];
}

export const createMasterHierarchy = (
  hierarchy: MasterHierarchy
): MasterHierarchy => hierarchy;

export const getHierarchyRootNodes = (
  hierarchy: MasterHierarchy
): MasterHierarchyNode[] =>
  hierarchy.nodes.filter(node => node.parentId === undefined);

export const getHierarchyNodeCount = (
  hierarchy: MasterHierarchy
): number => hierarchy.nodes.length;
