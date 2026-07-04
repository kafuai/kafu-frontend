import { KnowledgeAsset, KnowledgeTaxonomyNode } from "./knowledgeTypes";

export interface KnowledgeGap {
  taxonomyNodeId: string;
  taxonomyNodeName: string;
  reason: string;
  severity: "low" | "medium" | "high";
}

export function analyzeKnowledgeGaps(input: {
  taxonomyNodes: KnowledgeTaxonomyNode[];
  assets: KnowledgeAsset[];
}): KnowledgeGap[] {
  const gaps: KnowledgeGap[] = [];

  for (const node of input.taxonomyNodes) {
    const matchingAssets = input.assets.filter((asset) =>
      node.tags.some((tag) =>
        asset.metadata.tags
          .map((assetTag) => assetTag.toLowerCase())
          .includes(tag.toLowerCase()),
      ),
    );

    if (matchingAssets.length === 0) {
      gaps.push({
        taxonomyNodeId: node.id,
        taxonomyNodeName: node.name,
        reason: "No knowledge assets mapped to this taxonomy node.",
        severity: "high",
      });
      continue;
    }

    const activeAssets = matchingAssets.filter(
      (asset) => asset.status === "active",
    );

    if (activeAssets.length === 0) {
      gaps.push({
        taxonomyNodeId: node.id,
        taxonomyNodeName: node.name,
        reason: "Taxonomy node has assets but none are active.",
        severity: "medium",
      });
    }
  }

  return gaps;
}

export function getHighSeverityKnowledgeGaps(
  gaps: KnowledgeGap[],
): KnowledgeGap[] {
  return gaps.filter((gap) => gap.severity === "high");
}