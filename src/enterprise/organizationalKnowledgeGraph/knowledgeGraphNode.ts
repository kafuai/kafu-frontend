import {
  KnowledgeGraphMetadata,
  KnowledgeGraphNodeType,
} from "./knowledgeGraphTypes";

export interface KnowledgeGraphNode {
  readonly id: string;
  readonly type: KnowledgeGraphNodeType;
  readonly name: string;
  readonly description: string;
  readonly metadata: KnowledgeGraphMetadata;
  readonly attributes: Readonly<Record<string, string | number | boolean>>;
}

export function createKnowledgeGraphNode(
  node: KnowledgeGraphNode,
): KnowledgeGraphNode {
  return {
    ...node,
    attributes: { ...node.attributes },
    metadata: {
      ...node.metadata,
      tags: [...node.metadata.tags],
    },
  };
}