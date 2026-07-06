import { KnowledgeGraphNode } from "./knowledgeGraphNode";

export interface KnowledgeGraphSearchResult {
  readonly node: KnowledgeGraphNode;
  readonly score: number;
  readonly matchedFields: readonly string[];
}

export function searchKnowledgeGraphNodes(
  query: string,
  nodes: readonly KnowledgeGraphNode[],
): readonly KnowledgeGraphSearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [];
  }

  return nodes
    .map((node) => {
      const matchedFields: string[] = [];

      if (node.name.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push("name");
      }

      if (node.description.toLowerCase().includes(normalizedQuery)) {
        matchedFields.push("description");
      }

      if (
        node.metadata.tags.some((tag) =>
          tag.toLowerCase().includes(normalizedQuery),
        )
      ) {
        matchedFields.push("tags");
      }

      return {
        node,
        score: matchedFields.length,
        matchedFields,
      };
    })
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score);
}