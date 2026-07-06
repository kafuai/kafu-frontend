import { EnterpriseContext } from "./contextTypes";

export type ContextMemoryType =
  | "preference"
  | "decision"
  | "constraint"
  | "fact"
  | "relationship"
  | "historical_signal";

export interface ContextMemory {
  id: string;
  tenantId: string;
  profileId: string;
  type: ContextMemoryType;
  content: string;
  relatedContextIds: string[];
  confidence: number;
  createdAt: string;
  lastUsedAt?: string;
}

export function attachMemoryToContext(
  memory: ContextMemory,
  context: EnterpriseContext,
): ContextMemory {
  return {
    ...memory,
    relatedContextIds: Array.from(
      new Set([...memory.relatedContextIds, context.id]),
    ),
    lastUsedAt: new Date().toISOString(),
  };
}