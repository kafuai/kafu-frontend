import { ContextMemory } from "./contextMemory";
import { ContextSignal } from "./contextSignal";
import { EnterpriseContext } from "./contextTypes";

export interface AssembledContext {
  contexts: EnterpriseContext[];
  memories: ContextMemory[];
  signals: ContextSignal[];
}

export function assembleContext(
  contexts: EnterpriseContext[],
  memories: ContextMemory[],
  signals: ContextSignal[],
): AssembledContext {
  return {
    contexts,
    memories,
    signals,
  };
}