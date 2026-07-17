import {
  EnterpriseDemoFlow,
  EnterpriseDemoFlowExecutionContext,
  EnterpriseDemoFlowExecutionResult,
  EnterpriseDemoFlowStep,
} from "./demoIntegrationTypes";
import { DemoScenarioRegistry } from "./demoScenarioRegistry";

export type DemoFlowStepExecutor = (
  step: EnterpriseDemoFlowStep,
  context: EnterpriseDemoFlowExecutionContext,
) =>
  | Record<string, unknown>
  | Promise<Record<string, unknown>>;

export interface DemoFlowOrchestratorDependencies {
  scenarioRegistry: DemoScenarioRegistry;
  stepExecutor?: DemoFlowStepExecutor;
}

export class DemoFlowOrchestrator {
  constructor(
    private readonly dependencies:
      DemoFlowOrchestratorDependencies,
  ) {}

  createFlow(
    context: EnterpriseDemoFlowExecutionContext,
    steps: EnterpriseDemoFlowStep[],
  ): EnterpriseDemoFlow {
    const scenario =
      this.dependencies.scenarioRegistry.get(
        context.scenarioId,
      );

    if (!scenario) {
      throw new Error(
        `Demo scenario ${context.scenarioId} is not registered.`,
      );
    }

    if (scenario.status === "disabled") {
      throw new Error(
        `Demo scenario ${context.scenarioId} is disabled.`,
      );
    }

    const normalizedSteps = [...steps]
      .sort(
        (left, right) =>
          left.sequence - right.sequence,
      )
      .map((step) => ({
        ...step,
        scenarioId: context.scenarioId,
        status: "pending" as const,
        input: step.input
          ? { ...step.input }
          : undefined,
        output: undefined,
        error: null,
        startedAt: null,
        completedAt: null,
      }));

    return {
      id: `demo-flow-${context.sessionId}`,
      organizationId: context.organizationId,
      scenarioId: context.scenarioId,
      status: "ready",
      currentStepId: null,
      steps: normalizedSteps,
      startedAt: null,
      completedAt: null,
      error: null,
    };
  }

  async execute(
    flow: EnterpriseDemoFlow,
    context: EnterpriseDemoFlowExecutionContext,
  ): Promise<EnterpriseDemoFlowExecutionResult> {
    if (flow.scenarioId !== context.scenarioId) {
      throw new Error(
        "Demo flow scenario does not match execution context.",
      );
    }

    flow.status = "running";
    flow.startedAt = new Date().toISOString();
    flow.completedAt = null;
    flow.error = null;

    for (const step of flow.steps) {
      flow.currentStepId = step.id;
      step.status = "running";
      step.startedAt = new Date().toISOString();

      try {
        const output =
          await this.executeStep(step, context);

        step.output = output;
        step.status = "completed";
        step.completedAt = new Date().toISOString();
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unknown demo flow execution error.";

        step.status = "failed";
        step.error = message;
        step.completedAt = new Date().toISOString();

        flow.status = "failed";
        flow.error = message;
        flow.completedAt = new Date().toISOString();

        this.skipRemainingSteps(
          flow.steps,
          step.sequence,
        );

        break;
      }
    }

    if (flow.status !== "failed") {
      flow.status = "completed";
      flow.completedAt = new Date().toISOString();
    }

    flow.currentStepId = null;

    const successfulSteps = flow.steps.filter(
      (step) => step.status === "completed",
    ).length;

    const failedSteps = flow.steps.filter(
      (step) => step.status === "failed",
    ).length;

    const skippedSteps = flow.steps.filter(
      (step) => step.status === "skipped",
    ).length;

    const completionRate =
      flow.steps.length > 0
        ? Math.round(
            (successfulSteps / flow.steps.length) *
              100,
          )
        : 100;

    return {
      flow,
      successfulSteps,
      failedSteps,
      skippedSteps,
      completionRate,
      message:
        flow.status === "completed"
          ? "Enterprise demo flow completed successfully."
          : `Enterprise demo flow failed: ${
              flow.error ?? "Unknown error."
            }`,
    };
  }

  private async executeStep(
    step: EnterpriseDemoFlowStep,
    context: EnterpriseDemoFlowExecutionContext,
  ): Promise<Record<string, unknown>> {
    if (this.dependencies.stepExecutor) {
      return this.dependencies.stepExecutor(
        step,
        context,
      );
    }

    return {
      stepId: step.id,
      module: step.module,
      action: step.action,
      executed: true,
      executedAt: new Date().toISOString(),
    };
  }

  private skipRemainingSteps(
    steps: EnterpriseDemoFlowStep[],
    failedSequence: number,
  ): void {
    for (const step of steps) {
      if (
        step.sequence > failedSequence &&
        step.status === "pending"
      ) {
        step.status = "skipped";
        step.completedAt = new Date().toISOString();
      }
    }
  }
}
