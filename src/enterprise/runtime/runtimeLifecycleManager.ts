import { RuntimeLifecycleHook } from "./enterpriseRuntimeTypes";

export class RuntimeLifecycleManager {
  private readonly hooks: RuntimeLifecycleHook[] = [];

  register(hook: RuntimeLifecycleHook): void {
    this.hooks.push(hook);
  }

  startAll(): void {
    for (const hook of this.hooks) {
      hook.onStart?.();
    }
  }

  stopAll(): void {
    for (const hook of [...this.hooks].reverse()) {
      hook.onStop?.();
    }
  }

  count(): number {
    return this.hooks.length;
  }
}