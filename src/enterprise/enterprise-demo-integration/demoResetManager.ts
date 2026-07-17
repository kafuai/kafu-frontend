import { DemoDataInjector } from "./demoDataInjector";
import { DemoScenarioRegistry } from "./demoScenarioRegistry";
import { DemoSessionRuntime } from "./demoSessionRuntime";
import { DemoState } from "./demoState";

export interface EnterpriseDemoResetOptions {
  clearScenarios?: boolean;
  clearDatasets?: boolean;
  clearSessions?: boolean;
  clearState?: boolean;
}

export interface EnterpriseDemoResetResult {
  success: boolean;
  clearedScenarios: boolean;
  clearedDatasets: boolean;
  clearedSessions: boolean;
  clearedState: boolean;
  resetAt: string;
  messages: string[];
}

export interface DemoResetManagerDependencies {
  scenarioRegistry: DemoScenarioRegistry;
  sessionRuntime: DemoSessionRuntime;
  state: DemoState;
  dataInjector: DemoDataInjector;
}

export class DemoResetManager {
  constructor(
    private readonly dependencies: DemoResetManagerDependencies,
  ) {}

  reset(
    options: EnterpriseDemoResetOptions = {},
  ): EnterpriseDemoResetResult {
    const messages: string[] = [];

    const clearScenarios =
      options.clearScenarios ?? false;

    const clearDatasets =
      options.clearDatasets ?? true;

    const clearSessions =
      options.clearSessions ?? true;

    const clearState =
      options.clearState ?? true;

    if (clearScenarios) {
      this.dependencies.scenarioRegistry.clear();
      messages.push("Demo scenarios cleared.");
    }

    if (clearDatasets) {
      this.dependencies.dataInjector.clear();
      messages.push("Demo datasets cleared.");
    }

    if (clearSessions) {
      this.dependencies.sessionRuntime.clear();
      messages.push("Demo sessions cleared.");
    }

    if (clearState) {
      try {
        this.dependencies.state.setStatus("resetting");
        this.dependencies.state.reset();
        messages.push("Demo state reset.");
      } catch {
        messages.push(
          "Demo state was not initialized; state reset skipped.",
        );
      }
    }

    return {
      success: true,
      clearedScenarios: clearScenarios,
      clearedDatasets: clearDatasets,
      clearedSessions: clearSessions,
      clearedState: clearState,
      resetAt: new Date().toISOString(),
      messages,
    };
  }
}
