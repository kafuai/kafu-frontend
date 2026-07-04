import { createRuntimeToken } from "./runtimeTokens";
import { RuntimeRegistry } from "./runtimeRegistry";

export const RUNTIME_REGISTRY_TOKEN =
  createRuntimeToken<RuntimeRegistry>("runtime.registry");