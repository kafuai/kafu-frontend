import { RuntimeOrchestrator } from "./runtimeOrchestrator";

let instance: RuntimeOrchestrator | null = null;

export function getRuntime(): RuntimeOrchestrator {
  if (!instance) {
    instance = new RuntimeOrchestrator();
  }

  return instance;
}