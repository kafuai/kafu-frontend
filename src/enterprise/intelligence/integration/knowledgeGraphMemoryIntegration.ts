import {
  EnterpriseContext,
  ContextBuilder,
  KnowledgeGraphContextInput,
  OrganizationMemoryContextInput,
  mapKnowledgeGraphNodeToContext,
  mapOrganizationMemoryToContext,
} from "../context";

export function buildKnowledgeGraphMemoryContext(
  organizationId: string,
  nodes: KnowledgeGraphContextInput[],
  memories: OrganizationMemoryContextInput[],
): EnterpriseContext {
  const builder = new ContextBuilder();

  builder.addMany(nodes.map(mapKnowledgeGraphNodeToContext));
  builder.addMany(memories.map(mapOrganizationMemoryToContext));

  return builder.build(organizationId);
}