import { EnterpriseContextItem } from "./contextTypes";

export type OrganizationMemoryContextInput = {
  organizationId: string;
  memoryId: string;
  title: string;
  summary: string;
  confidence?: number;
  tags?: string[];
};

export function mapOrganizationMemoryToContext(
  memory: OrganizationMemoryContextInput,
): EnterpriseContextItem {
  return {
    id: memory.memoryId,
    source: "organization_memory",
    title: memory.title,
    summary: memory.summary,
    confidence: memory.confidence ?? 0.85,
    tags: memory.tags ?? [],
  };
}