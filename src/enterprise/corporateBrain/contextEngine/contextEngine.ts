import { AssembledContext, assembleContext } from "./contextAssembler";
import { ContextMemory } from "./contextMemory";
import { ContextProfile } from "./contextProfile";
import { resolveContext } from "./contextResolver";
import { ContextSignal } from "./contextSignal";
import { ContextState } from "./contextState";
import { EnterpriseContext } from "./contextTypes";

export interface ContextEngineInput {
  profile: ContextProfile;
  contexts: EnterpriseContext[];
  memories: ContextMemory[];
  signals: ContextSignal[];
}

export interface ContextEngineOutput {
  assembled: AssembledContext;
  state: ContextState;
  confidence: number;
  activeSignalIds: string[];
}

export function runContextEngine(
  input: ContextEngineInput,
): ContextEngineOutput {
  const state: ContextState = {
    profile: input.profile,
    memories: input.memories,
    signals: input.signals,
    resolvedAt: new Date().toISOString(),
  };

  const resolution = resolveContext(state);

  return {
    assembled: assembleContext(input.contexts, input.memories, input.signals),
    state: resolution.state,
    confidence: resolution.confidence,
    activeSignalIds: resolution.activeSignalIds,
  };
}