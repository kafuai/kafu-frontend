import {
  UnifiedActivityWorkflow,
} from "./unifiedActivityWorkflow";

export type UnifiedActivityRuntime = {
  workflow: UnifiedActivityWorkflow;
};

export function createUnifiedActivityRuntime():
  UnifiedActivityRuntime {
  return {
    workflow:
      new UnifiedActivityWorkflow(),
  };
}

export const unifiedActivityRuntime =
  createUnifiedActivityRuntime();
