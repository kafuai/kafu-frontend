export interface KnowledgeGrowth {
  organizationId: string;
  knowledgeAreas: string[];
  growthInitiatives: string[];
}

export function hasKnowledgeGrowth(
  growth: KnowledgeGrowth
): boolean {
  return (
    growth.growthInitiatives.length > 0
  );
}
