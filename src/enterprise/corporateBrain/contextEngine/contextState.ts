import { ContextMemory } from "./contextMemory";
import { ContextProfile } from "./contextProfile";
import { ContextSignal } from "./contextSignal";

export interface ContextState {
  profile: ContextProfile;
  memories: ContextMemory[];
  signals: ContextSignal[];
  resolvedAt: string;
}

export function createContextState(
  profile: ContextProfile,
): ContextState {
  return {
    profile,
    memories: [],
    signals: [],
    resolvedAt: new Date().toISOString(),
  };
}