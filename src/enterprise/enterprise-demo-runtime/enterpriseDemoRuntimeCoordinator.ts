import {
  EnterpriseDemoIntegration,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeContext,
} from "./enterpriseDemoRuntimeContext";
import {
  EnterpriseDemoRuntimeExecutionInput,
  EnterpriseDemoRuntimeExecutionResult,
  EnterpriseDemoRuntimeInitializationInput,
  EnterpriseDemoRuntimeInitializationResult,
} from "./enterpriseDemoRuntimeTypes";

export interface EnterpriseDemoRuntimeCoordinatorDependencies {
  integration: EnterpriseDemoIntegration;
  context?: EnterpriseDemoRuntimeContext;
}

export class EnterpriseDemoRuntimeCoordinator {
  private readonly context:
    EnterpriseDemoRuntimeContext;

  constructor(
    private readonly dependencies:
      EnterpriseDemoRuntimeCoordinatorDependencies,
  ) {
    this.context =
      dependencies.context ??
      new EnterpriseDemoRuntimeContext();
  }

  initialize(
    input: EnterpriseDemoRuntimeInitializationInput,
  ): EnterpriseDemoRuntimeInitializationResult {
    this.context.initialize(input.configuration);

    try {
      const bootstrap =
        this.dependencies.integration.bootstrap.bootstrap(
          input.configuration,
          input.scenarios ?? [],
        );

      const state =
        this.dependencies.integration.state.initialize({
          organizationId:
            input.configuration.organizationId,
          workspaceId:
            input.configuration.workspaceId,
          metadata: {
            ...(input.configuration.metadata ?? {}),
            environment:
              input.configuration.environment,
            initializedBy:
              input.configuration.initiatedBy,
          },
        });

      const selectedScenario = bootstrap.selectedScenarioId
        ? this.dependencies.integration.scenarioRegistry.get(
            bootstrap.selectedScenarioId,
          )
        : null;

      this.context.setBootstrap(bootstrap);
      this.context.setSelectedScenario(
        selectedScenario,
      );
      this.context.setState(state);
      this.context.setStatus("ready");

      return {
        status: "ready",
        bootstrap,
        state,
        initializedAt: bootstrap.initializedAt,
      };
    } catch (error) {
      this.context.fail(error);
      throw error;
    }
  }

  async execute(
    input: EnterpriseDemoRuntimeExecutionInput,
  ): Promise<EnterpriseDemoRuntimeExecutionResult> {
    const runtimeContext =
      this.context.getSnapshot();

    const scenarioId =
      input.scenarioId ??
      runtimeContext.selectedScenario?.id ??
      runtimeContext.bootstrap?.selectedScenarioId;

    if (!scenarioId) {
      throw new Error(
        "Enterprise demo runtime scenarioId is required.",
      );
    }

    const scenario =
      this.dependencies.integration.scenarioRegistry.get(
        scenarioId,
      );

    if (!scenario) {
      throw new Error(
        `Enterprise demo runtime scenario ${scenarioId} was not found.`,
      );
    }

    const initiatedBy =
      input.initiatedBy ??
      runtimeContext.configuration.initiatedBy;

    const startedAt = new Date().toISOString();

    try {
      this.context.setStatus("executing");

      const session =
        this.dependencies.integration.sessionRuntime.create({
          organizationId:
            runtimeContext.configuration.organizationId,
          workspaceId:
            runtimeContext.configuration.workspaceId,
          scenarioId,
          initiatedBy,
          metadata: {
            ...(runtimeContext.configuration.metadata ?? {}),
            ...(input.metadata ?? {}),
          },
        });

      this.dependencies.integration.state.setActiveSession(
        session,
      );

      const flow =
        this.dependencies.integration.flowOrchestrator.createFlow(
          {
            organizationId: session.organizationId,
            workspaceId: session.workspaceId,
            sessionId: session.id,
            scenarioId,
            initiatedBy,
            metadata: {
              ...session.metadata,
            },
          },
          input.steps,
        );

      const runningSession =
        this.dependencies.integration.sessionRuntime.attachFlow(
          session.id,
          flow,
        );

      this.dependencies.integration.state.setActiveSession(
        runningSession,
      );
      this.dependencies.integration.state.setActiveFlow(
        flow,
      );

      const execution =
        await this.dependencies.integration.flowOrchestrator.execute(
          flow,
          {
            organizationId: session.organizationId,
            workspaceId: session.workspaceId,
            sessionId: session.id,
            scenarioId,
            initiatedBy,
            metadata: {
              ...session.metadata,
            },
          },
        );

      const completedSession =
        this.dependencies.integration.sessionRuntime.attachFlow(
          session.id,
          execution.flow,
        );

      this.dependencies.integration.state.setActiveSession(
        completedSession,
      );
      this.dependencies.integration.state.setActiveFlow(
        execution.flow,
      );

      const state =
        this.dependencies.integration.state.getSnapshot();

      const runtimeStatus =
        execution.flow.status === "completed"
          ? "completed"
          : "failed";

      this.context.setState(state);
      this.context.setStatus(runtimeStatus);

      return {
        status: runtimeStatus,
        sessionId: session.id,
        scenarioId,
        execution,
        state,
        startedAt,
        completedAt: new Date().toISOString(),
      };
    } catch (error) {
      this.context.fail(error);
      throw error;
    }
  }

  getContext(): EnterpriseDemoRuntimeContext {
    return this.context;
  }
}
