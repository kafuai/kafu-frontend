import { KnowledgeTaxonomyNode } from "./knowledgeTypes";

export interface CreateKnowledgeTaxonomyNodeInput {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  childrenIds?: string[];
  tags?: string[];
}

export function createKnowledgeTaxonomyNode(
  input: CreateKnowledgeTaxonomyNodeInput,
): KnowledgeTaxonomyNode {
  return {
    id: input.id,
    name: input.name,
    description: input.description,
    parentId: input.parentId,
    childrenIds: input.childrenIds ?? [],
    tags: input.tags ?? [],
  };
}

export function addChildTaxonomyNode(
  parent: KnowledgeTaxonomyNode,
  childId: string,
): KnowledgeTaxonomyNode {
  if (parent.childrenIds.includes(childId)) {
    return parent;
  }

  return {
    ...parent,
    childrenIds: [...parent.childrenIds, childId],
  };
}

export function removeChildTaxonomyNode(
  parent: KnowledgeTaxonomyNode,
  childId: string,
): KnowledgeTaxonomyNode {
  return {
    ...parent,
    childrenIds: parent.childrenIds.filter((id) => id !== childId),
  };
}

export function findTaxonomyNodeById(
  nodes: KnowledgeTaxonomyNode[],
  id: string,
): KnowledgeTaxonomyNode | undefined {
  return nodes.find((node) => node.id === id);
}

export function getRootTaxonomyNodes(
  nodes: KnowledgeTaxonomyNode[],
): KnowledgeTaxonomyNode[] {
  return nodes.filter((node) => !node.parentId);
}