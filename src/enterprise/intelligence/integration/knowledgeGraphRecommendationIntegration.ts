import {
  EnterpriseContext,
  ContextBuilder,
  KnowledgeGraphContextInput,
  ExecutiveRecommendationContextInput,
  mapKnowledgeGraphNodeToContext,
  mapExecutiveRecommendationToContext,
} from "../context";

export function buildKnowledgeGraphRecommendationContext(
  organizationId: string,
  nodes: KnowledgeGraphContextInput[],
  recommendations: ExecutiveRecommendationContextInput[],
): EnterpriseContext {
  const builder = new ContextBuilder();

  builder.addMany(nodes.map(mapKnowledgeGraphNodeToContext));
  builder.addMany(recommendations.map(mapExecutiveRecommendationToContext));

  return builder.build(organizationId);
}