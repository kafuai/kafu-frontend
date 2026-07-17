import {
  EnterpriseDemoExperienceState,
} from "./enterpriseDemoExperienceTypes";

export interface EnterpriseDemoExperienceViewModel {
  title: string;
  subtitle?: string | null;
  stageLabel: string;
  statusLabel: string;
  selectedScenarioTitle?: string | null;
  progressLabel: string;
  progressPercentage: number;
  canStart: boolean;
  canReset: boolean;
  hasError: boolean;
  errorMessage?: string | null;
}

export class EnterpriseDemoExperienceViewModelBuilder {
  build(
    state: EnterpriseDemoExperienceState,
  ): EnterpriseDemoExperienceViewModel {
    const selectedScenario =
      state.scenarios.find(
        (scenario) =>
          scenario.id ===
          state.selectedScenarioId,
      );

    return {
      title: state.configuration.title,
      subtitle:
        state.configuration.subtitle ?? null,
      stageLabel:
        this.getStageLabel(state.stage),
      statusLabel:
        this.getStatusLabel(
          state.runtimeStatus,
        ),
      selectedScenarioTitle:
        selectedScenario?.title ?? null,
      progressLabel:
        state.progress.totalSteps > 0
          ? `${state.progress.completedSteps} of ${state.progress.totalSteps} steps completed`
          : "Not started",
      progressPercentage:
        state.progress.percentage,
      canStart:
        state.stage === "ready" &&
        Boolean(state.selectedScenarioId),
      canReset:
        state.stage === "results" ||
        state.stage === "error",
      hasError:
        Boolean(state.errorMessage),
      errorMessage:
        state.errorMessage ?? null,
    };
  }

  private getStageLabel(
    stage: EnterpriseDemoExperienceState["stage"],
  ): string {
    switch (stage) {
      case "welcome":
        return "Welcome";
      case "scenario-selection":
        return "Select Scenario";
      case "ready":
        return "Ready";
      case "running":
        return "Demo Running";
      case "results":
        return "Demo Results";
      case "error":
        return "Demo Error";
    }
  }

  private getStatusLabel(
    status: EnterpriseDemoExperienceState["runtimeStatus"],
  ): string {
    switch (status) {
      case "idle":
        return "Idle";
      case "initializing":
        return "Initializing";
      case "ready":
        return "Ready";
      case "executing":
        return "Executing";
      case "completed":
        return "Completed";
      case "failed":
        return "Failed";
      case "resetting":
        return "Resetting";
    }
  }
}
