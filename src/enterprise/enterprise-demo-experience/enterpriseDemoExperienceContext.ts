import {
  EnterpriseDemoExperienceConfiguration,
  EnterpriseDemoExperienceProgress,
  EnterpriseDemoExperienceScenarioOption,
  EnterpriseDemoExperienceStage,
  EnterpriseDemoExperienceState,
  EnterpriseDemoExperienceProgressInput,
} from "./enterpriseDemoExperienceTypes";
import {
  EnterpriseDemoRuntimeSnapshot,
  EnterpriseDemoRuntimeStatus,
} from "../enterprise-demo-runtime";

function createInitialProgress():
  EnterpriseDemoExperienceProgress {
  return {
    currentStep: 0,
    totalSteps: 0,
    completedSteps: 0,
    percentage: 0,
    activeStepId: null,
    activeStepTitle: null,
  };
}

export class EnterpriseDemoExperienceContext {
  private state:
    EnterpriseDemoExperienceState | null = null;

  initialize(
    configuration: EnterpriseDemoExperienceConfiguration,
    scenarios: EnterpriseDemoExperienceScenarioOption[] = [],
  ): EnterpriseDemoExperienceState {
    const selectedScenario =
      configuration.defaultScenarioId &&
      scenarios.some(
        (scenario) =>
          scenario.id ===
            configuration.defaultScenarioId &&
          scenario.enabled,
      )
        ? configuration.defaultScenarioId
        : scenarios.find(
            (scenario) =>
              scenario.recommended &&
              scenario.enabled,
          )?.id ??
          scenarios.find(
            (scenario) => scenario.enabled,
          )?.id ??
          null;

    this.state = {
      configuration: {
        ...configuration,
        metadata: {
          ...(configuration.metadata ?? {}),
        },
      },
      stage: selectedScenario
        ? "ready"
        : "scenario-selection",
      runtimeStatus: "idle",
      selectedScenarioId: selectedScenario,
      scenarios: scenarios.map(
        (scenario) => ({
          ...scenario,
        }),
      ),
      progress: createInitialProgress(),
      runtimeSnapshot: null,
      errorMessage: null,
      startedAt: null,
      completedAt: null,
      updatedAt: new Date().toISOString(),
    };

    return this.getSnapshot();
  }

  setStage(
    stage: EnterpriseDemoExperienceStage,
  ): EnterpriseDemoExperienceState {
    const state = this.requireState();

    state.stage = stage;
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  setRuntimeStatus(
    status: EnterpriseDemoRuntimeStatus,
  ): EnterpriseDemoExperienceState {
    const state = this.requireState();

    state.runtimeStatus = status;
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  selectScenario(
    scenarioId: string,
  ): EnterpriseDemoExperienceState {
    const state = this.requireState();

    const scenario =
      state.scenarios.find(
        (item) => item.id === scenarioId,
      );

    if (!scenario) {
      throw new Error(
        `Enterprise demo experience scenario ${scenarioId} was not found.`,
      );
    }

    if (!scenario.enabled) {
      throw new Error(
        `Enterprise demo experience scenario ${scenarioId} is disabled.`,
      );
    }

    state.selectedScenarioId = scenarioId;
    state.stage = "ready";
    state.errorMessage = null;
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  updateProgress(
    input: EnterpriseDemoExperienceProgressInput,
  ): EnterpriseDemoExperienceState {
    const state = this.requireState();

    const totalSteps =
      Math.max(0, input.totalSteps);

    const currentStep =
      Math.min(
        Math.max(0, input.currentStep),
        totalSteps,
      );

    const completedSteps =
      Math.min(
        Math.max(
          0,
          input.completedSteps ??
            Math.max(0, currentStep - 1),
        ),
        totalSteps,
      );

    state.progress = {
      currentStep,
      totalSteps,
      completedSteps,
      percentage:
        totalSteps > 0
          ? Math.round(
              (completedSteps / totalSteps) *
                100,
            )
          : 0,
      activeStepId:
        input.activeStepId ?? null,
      activeStepTitle:
        input.activeStepTitle ?? null,
    };

    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  attachRuntimeSnapshot(
    snapshot: EnterpriseDemoRuntimeSnapshot,
  ): EnterpriseDemoExperienceState {
    const state = this.requireState();

    state.runtimeSnapshot = snapshot;
    state.runtimeStatus = snapshot.status;
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  start(): EnterpriseDemoExperienceState {
    const state = this.requireState();

    if (!state.selectedScenarioId) {
      throw new Error(
        "Enterprise demo experience requires a selected scenario.",
      );
    }

    state.stage = "running";
    state.runtimeStatus = "executing";
    state.startedAt =
      new Date().toISOString();
    state.completedAt = null;
    state.errorMessage = null;
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  complete(): EnterpriseDemoExperienceState {
    const state = this.requireState();

    state.stage = "results";
    state.runtimeStatus = "completed";
    state.completedAt =
      new Date().toISOString();
    state.progress = {
      ...state.progress,
      completedSteps:
        state.progress.totalSteps,
      currentStep:
        state.progress.totalSteps,
      percentage:
        state.progress.totalSteps > 0
          ? 100
          : 0,
      activeStepId: null,
      activeStepTitle: null,
    };
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  fail(
    error: unknown,
  ): EnterpriseDemoExperienceState {
    const state = this.requireState();

    state.stage = "error";
    state.runtimeStatus = "failed";
    state.errorMessage =
      error instanceof Error
        ? error.message
        : String(error);
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  reset(): EnterpriseDemoExperienceState {
    const state = this.requireState();

    state.stage = state.selectedScenarioId
      ? "ready"
      : "scenario-selection";
    state.runtimeStatus = "ready";
    state.progress =
      createInitialProgress();
    state.runtimeSnapshot = null;
    state.errorMessage = null;
    state.startedAt = null;
    state.completedAt = null;
    state.updatedAt =
      new Date().toISOString();

    return this.getSnapshot();
  }

  getSnapshot():
    EnterpriseDemoExperienceState {
    const state = this.requireState();

    return {
      ...state,
      configuration: {
        ...state.configuration,
        metadata: {
          ...(state.configuration
            .metadata ?? {}),
        },
      },
      scenarios: state.scenarios.map(
        (scenario) => ({
          ...scenario,
        }),
      ),
      progress: {
        ...state.progress,
      },
      runtimeSnapshot:
        state.runtimeSnapshot
          ? {
              ...state.runtimeSnapshot,
              sessions:
                state.runtimeSnapshot.sessions.map(
                  (session) => ({
                    ...session,
                    metadata: {
                      ...session.metadata,
                    },
                  }),
                ),
            }
          : null,
    };
  }

  private requireState():
    EnterpriseDemoExperienceState {
    if (!this.state) {
      throw new Error(
        "Enterprise demo experience context has not been initialized.",
      );
    }

    return this.state;
  }
}
