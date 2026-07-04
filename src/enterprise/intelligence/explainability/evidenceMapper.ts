import { EnterpriseContextItem } from "../context";
import { ExplainabilityEvidence } from "./explainabilityTypes";

export function mapContextItemToEvidence(
  item: EnterpriseContextItem,
): ExplainabilityEvidence {
  return {
    sourceId: item.id,
    sourceType: item.source,
    summary: item.summary,
    confidence: item.confidence,
  };
}