import {
  EnterpriseDemoIntegration,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContext,
} from "./enterpriseDemoRuntimeContext";
import {
  EnterpriseDemoRuntimeCoordinator,
} from "./enterpriseDemoRuntimeCoordinator";
import {
  EnterpriseDemoRuntimeExecutionGuard,
} from "./enterpriseDemoRuntimeExecutionGuard";
import {
  EnterpriseDemoRuntimeLifecycle,
} from "./enterpriseDemoRuntimeLifecycle";
import {
  EnterpriseDemoRuntimeScenarioResolver,
} from "./enterpriseDemoRuntimeScenarioResolver";
import {
  EnterpriseDemoRuntimeExecutionInput,
  EnterpriseDemoRuntimeExecutionResult,
  EnterpriseDemoRuntimeInitializationInput,
  EnterpriseDemoRuntimeInitializationResult,
} from "./enterpriseDemoRuntimeTypes";

export interface EnterpriseDemoRuntimeControllerDependencies {
  integration: EnterpriseDemoIntegration;
  context?: EnterpriseDemoRuntimeContext;
}

export class EnterpriseDemoRuntimeController {
  private readonly context:
    EnterpriseDemoRuntimeContext;

  private readonly coordinator:
    EnterpriseDemoRuntimeCoordinator;

  private readonly scenarioResolver:
    EnterpriseDemoRuntimeScenarioResolver;

  private readonly executionGuard:
    EnterpriseDemoRuntimeExecutionGuard;

  private readonly lifecycle:
    EnterpriseDemoRuntimeLifecycle;

  constructor(
    dependencies:
      EnterpriseDemoRuntimeControllerDependencies,
  ) {
    this.context =
      dependencies.context ??
      new EnterpriseDemoRuntimeContext();

    this.coordinator =
      new EnterpriseDemoRuntimeCoordinator({
        integration: dependencies.integration,
        context: this.context,
      });

    this.scenarioResolver =
      new EnterpriseDemoRuntimeScenarioResolver(
        dependencies.integration.scenarioRegistry,
      );

    this.executionGuard =
      new EnterpriseDemoRuntimeExecutionGuard();

    this.lifecycle =
      new EnterpriseDemoRuntimeLifecycle({
        integration: dependencies.integration,
        context: this.context,
      });
  }

  initialize(
    input: EnterpriseDemoRuntimeInitializationInput,
  ): EnterpriseDemoRuntimeInitializationResult {
    return this.coordinator.initialize(input);
  }

  async execute(
    input: EnterpriseDemoRuntimeExecutionInput,
  ): Promise<EnterpriseDemoRuntimeExecutionResult> {
    const context =
      this.context.getSnapshot();

    const scenario =
      this.scenarioResolver.resolve({
        requestedScenarioId:
          input.scenarioId ?? null,
        defaultScenarioId:
          context.bootstrap?.selectedScenarioId ??
          context.configuration.defaultScenarioId ??
          null,
        organizationId:
          context.configuration.organizationId,
      });

    const initiatedBy =
      input.initiatedBy ??
      context.configuration.initiatedBy;

    this.executionGuard.validate({
      context,
      scenario,
      steps: input.steps,
      initiatedBy,
    });

    try {
      this.lifecycle.transition("executing");

      const result =
        await this.coordinator.execute({
          ...input,
          scenarioId: scenario.id,
          initiatedBy,
        });

      if (result.status === "completed") {
        this.lifecycle.complete();
      }

      return result;
    } catch (error) {
      this.lifecycle.fail(error);
      throw error;
    }
  }

  reset(): void {
    this.lifecycle.reset();
  }

  getContext(): EnterpriseDemoRuntimeContext {
    return this.context;
  }
}
