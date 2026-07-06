import { KnowledgeGraphRelation } from "./knowledgeGraphRelation";

export interface KnowledgeGraphPath {
  readonly nodeIds: readonly string[];
  readonly relationIds: readonly string[];
}

export function findKnowledgeGraphPath(
  fromNodeId: string,
  toNodeId: string,
  relations: readonly KnowledgeGraphRelation[],
): KnowledgeGraphPath | undefined {
  if (fromNodeId === toNodeId) {
    return {
      nodeIds: [fromNodeId],
      relationIds: [],
    };
  }

  const queue: KnowledgeGraphPath[] = [
    {
      nodeIds: [fromNodeId],
      relationIds: [],
    },
  ];

  const visited = new Set<string>([fromNodeId]);

  while (queue.length > 0) {
    const currentPath = queue.shift();

    if (!currentPath) {
      continue;
    }

    const currentNodeId = currentPath.nodeIds[currentPath.nodeIds.length - 1];

    const outgoingRelations = relations.filter(
      (relation) => relation.fromNodeId === currentNodeId,
    );

    for (const relation of outgoingRelations) {
      if (visited.has(relation.toNodeId)) {
        continue;
      }

      const nextPath: KnowledgeGraphPath = {
        nodeIds: [...currentPath.nodeIds, relation.toNodeId],
        relationIds: [...currentPath.relationIds, relation.id],
      };

      if (relation.toNodeId === toNodeId) {
        return nextPath;
      }

      visited.add(relation.toNodeId);
      queue.push(nextPath);
    }
  }

  return undefined;
}