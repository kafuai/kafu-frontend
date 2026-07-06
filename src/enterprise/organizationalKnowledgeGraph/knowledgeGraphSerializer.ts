import { KnowledgeGraphSnapshot } from "./knowledgeGraphSnapshot";

export function serializeKnowledgeGraph(
  snapshot: KnowledgeGraphSnapshot,
): string {
  return JSON.stringify(snapshot, null, 2);
}

export function deserializeKnowledgeGraph(
  json: string,
): KnowledgeGraphSnapshot {
  return JSON.parse(json) as KnowledgeGraphSnapshot;
}