import {
  EnterpriseDemoFlowStep,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeExecutionResult,
  EnterpriseDemoRuntimeService,
} from "../enterprise-demo-runtime";
import {
  EnterpriseDemoExperienceContext,
} from "./enterpriseDemoExperienceContext";
import {
  EnterpriseDemoExperienceState,
} from "./enterpriseDemoExperienceTypes";

export interface EnterpriseDemoExperienceExecutionInput {
  steps: EnterpriseDemoFlowStep[];
  initiatedBy?: string;
  metadata?: Record<string, unknown>;
}

export interface EnterpriseDemoExperienceExecutionResult {
  experience: EnterpriseDemoExperienceState;
  runtime: EnterpriseDemoRuntimeExecutionResult;
}

export interface EnterpriseDemoExperienceOrchestratorDependencies {
  runtime: EnterpriseDemoRuntimeService;
  context: EnterpriseDemoExperienceContext;
}

export class EnterpriseDemoExperienceOrchestrator {
  constructor(
    private readonly dependencies:
      EnterpriseDemoExperienceOrchestratorDependencies,
  ) {}

  async execute(
    input: EnterpriseDemoExperienceExecutionInput,
  ): Promise<EnterpriseDemoExperienceExecutionResult> {
    const experience =
      this.dependencies.context.getSnapshot();

    if (!experience.selectedScenarioId) {
      throw new Error(
        "Enterprise demo experience requires a selected scenario.",
      );
    }

    if (input.steps.length === 0) {
      throw new Error(
        "Enterprise demo experience requires at least one execution step.",
      );
    }

    this.dependencies.context.start();

    try {
      this.dependencies.context.updateProgress({
        currentStep: 1,
        totalSteps: input.steps.length,
        completedSteps: 0,
        activeStepId: input.steps[0]?.id ?? null,
        activeStepTitle:
          input.steps[0]?.title ?? null,
      });

      const runtime =
        await this.dependencies.runtime.execute({
          scenarioId:
            experience.selectedScenarioId,
          steps: input.steps,
          initiatedBy:
            input.initiatedBy ??
            experience.configuration.initiatedBy,
          metadata: {
            ...(experience.configuration.metadata ?? {}),
            ...(input.metadata ?? {}),
            experienceMode:
              experience.configuration.mode,
          },
        });

      const runtimeSnapshot =
        this.dependencies.runtime.getSnapshot();

      this.dependencies.context.attachRuntimeSnapshot(
        runtimeSnapshot,
      );

      const completedExperience =
        this.dependencies.context.complete();

      return {
        experience: completedExperience,
        runtime,
      };
    } catch (error) {
      this.dependencies.context.fail(error);
      throw error;
    }
  }
}
