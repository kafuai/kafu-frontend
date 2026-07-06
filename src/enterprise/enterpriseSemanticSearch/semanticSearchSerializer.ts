import { SemanticSearchSnapshot } from "./semanticSearchSnapshot";

export function serializeSemanticSearchSnapshot(
  snapshot: SemanticSearchSnapshot,
): string {
  return JSON.stringify(snapshot, null, 2);
}

export function deserializeSemanticSearchSnapshot(
  payload: string,
): SemanticSearchSnapshot {
  return JSON.parse(payload) as SemanticSearchSnapshot;
}