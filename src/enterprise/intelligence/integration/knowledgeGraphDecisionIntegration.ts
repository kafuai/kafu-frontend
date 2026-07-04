import {
  EnterpriseContext,
  ContextBuilder,
  KnowledgeGraphContextInput,
  ExecutiveDecisionContextInput,
  mapKnowledgeGraphNodeToContext,
  mapExecutiveDecisionToContext,
} from "../context";

export function buildKnowledgeGraphDecisionContext(
  organizationId: string,
  nodes: KnowledgeGraphContextInput[],
  decisions: ExecutiveDecisionContextInput[],
): EnterpriseContext {
  const builder = new ContextBuilder();

  builder.addMany(nodes.map(mapKnowledgeGraphNodeToContext));
  builder.addMany(decisions.map(mapExecutiveDecisionToContext));

  return builder.build(organizationId);
}