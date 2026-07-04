import {
  EnterpriseContext,
  ContextBuilder,
  KnowledgeGraphContextInput,
  ExecutiveReasoningContextInput,
  mapKnowledgeGraphNodeToContext,
  mapExecutiveReasoningToContext,
} from "../context";

export function buildKnowledgeGraphReasoningContext(
  organizationId: string,
  nodes: KnowledgeGraphContextInput[],
  reasoning: ExecutiveReasoningContextInput[],
): EnterpriseContext {
  const builder = new ContextBuilder();

  builder.addMany(nodes.map(mapKnowledgeGraphNodeToContext));
  builder.addMany(reasoning.map(mapExecutiveReasoningToContext));

  return builder.build(organizationId);
}