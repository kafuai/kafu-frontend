import {
  EnterpriseDemoBootstrapConfiguration,
  EnterpriseDemoBootstrapResult,
  EnterpriseDemoScenario,
} from "./demoIntegrationTypes";
import { DemoScenarioRegistry } from "./demoScenarioRegistry";

export interface DemoBootstrapDependencies {
  scenarioRegistry: DemoScenarioRegistry;
}

export class DemoBootstrap {
  constructor(
    private readonly dependencies: DemoBootstrapDependencies,
  ) {}

  bootstrap(
    configuration: EnterpriseDemoBootstrapConfiguration,
    scenarios: EnterpriseDemoScenario[] = [],
  ): EnterpriseDemoBootstrapResult {
    const messages: string[] = [];

    if (!configuration.organizationId.trim()) {
      throw new Error("Demo organizationId is required.");
    }

    if (!configuration.workspaceId.trim()) {
      throw new Error("Demo workspaceId is required.");
    }

    for (const scenario of scenarios) {
      this.dependencies.scenarioRegistry.register(scenario);
    }

    const registeredScenarios =
      this.dependencies.scenarioRegistry.list({
        organizationId: configuration.organizationId,
        includeDisabled: false,
      });

    const selectedScenario =
      configuration.defaultScenarioId
        ? this.dependencies.scenarioRegistry.get(
            configuration.defaultScenarioId,
          )
        : registeredScenarios[0] ?? null;

    if (configuration.defaultScenarioId && !selectedScenario) {
      messages.push(
        `Default scenario ${configuration.defaultScenarioId} was not found.`,
      );
    }

    if (registeredScenarios.length === 0) {
      messages.push(
        "Demo bootstrap completed without registered scenarios.",
      );
    } else {
      messages.push(
        `${registeredScenarios.length} demo scenario(s) registered.`,
      );
    }

    if (configuration.enableDiagnostics) {
      messages.push("Demo diagnostics enabled.");
    }

    if (configuration.enableDataInjection) {
      messages.push("Demo data injection enabled.");
    }

    if (configuration.enableReset) {
      messages.push("Demo reset capability enabled.");
    }

    if (configuration.autoStart && selectedScenario) {
      messages.push(
        `Scenario ${selectedScenario.id} selected for automatic start.`,
      );
    }

    return {
      status: "ready",
      organizationId: configuration.organizationId,
      workspaceId: configuration.workspaceId,
      registeredScenarioIds: registeredScenarios.map(
        (scenario) => scenario.id,
      ),
      selectedScenarioId: selectedScenario?.id ?? null,
      initializedAt: new Date().toISOString(),
      messages,
    };
  }
}
