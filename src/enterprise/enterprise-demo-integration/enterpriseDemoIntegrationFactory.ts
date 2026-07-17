import {
  DemoBootstrap,
} from "./demoBootstrap";
import {
  DemoDataInjector,
} from "./demoDataInjector";
import {
  DemoDiagnostics,
} from "./demoDiagnostics";
import {
  DemoFlowOrchestrator,
  DemoFlowStepExecutor,
} from "./demoFlowOrchestrator";
import {
  DemoResetManager,
} from "./demoResetManager";
import {
  DemoScenarioRegistry,
} from "./demoScenarioRegistry";
import {
  DemoSessionRuntime,
} from "./demoSessionRuntime";
import {
  DemoState,
} from "./demoState";

export interface EnterpriseDemoIntegration {
  scenarioRegistry: DemoScenarioRegistry;
  bootstrap: DemoBootstrap;
  flowOrchestrator: DemoFlowOrchestrator;
  sessionRuntime: DemoSessionRuntime;
  state: DemoState;
  dataInjector: DemoDataInjector;
  resetManager: DemoResetManager;
  diagnostics: DemoDiagnostics;
}

export interface CreateEnterpriseDemoIntegrationOptions {
  stepExecutor?: DemoFlowStepExecutor;
}

export function createEnterpriseDemoIntegration(
  options: CreateEnterpriseDemoIntegrationOptions = {},
): EnterpriseDemoIntegration {
  const scenarioRegistry =
    new DemoScenarioRegistry();

  const sessionRuntime =
    new DemoSessionRuntime();

  const state =
    new DemoState();

  const dataInjector =
    new DemoDataInjector();

  const bootstrap =
    new DemoBootstrap({
      scenarioRegistry,
    });

  const flowOrchestrator =
    new DemoFlowOrchestrator({
      scenarioRegistry,
      stepExecutor: options.stepExecutor,
    });

  const resetManager =
    new DemoResetManager({
      scenarioRegistry,
      sessionRuntime,
      state,
      dataInjector,
    });

  const diagnostics =
    new DemoDiagnostics({
      scenarioRegistry,
      sessionRuntime,
      state,
      dataInjector,
    });

  return {
    scenarioRegistry,
    bootstrap,
    flowOrchestrator,
    sessionRuntime,
    state,
    dataInjector,
    resetManager,
    diagnostics,
  };
}

export class EnterpriseDemoIntegrationFactory {
  static create(
    options: CreateEnterpriseDemoIntegrationOptions = {},
  ): EnterpriseDemoIntegration {
    return createEnterpriseDemoIntegration(options);
  }
}
