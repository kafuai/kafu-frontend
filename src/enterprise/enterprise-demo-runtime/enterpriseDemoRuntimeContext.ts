import {
  EnterpriseDemoBootstrapResult,
  EnterpriseDemoScenario,
  EnterpriseDemoStateSnapshot,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeConfiguration,
  EnterpriseDemoRuntimeStatus,
} from "./enterpriseDemoRuntimeTypes";

export interface EnterpriseDemoRuntimeContextSnapshot {
  configuration: EnterpriseDemoRuntimeConfiguration;
  status: EnterpriseDemoRuntimeStatus;
  bootstrap?: EnterpriseDemoBootstrapResult | null;
  selectedScenario?: EnterpriseDemoScenario | null;
  state?: EnterpriseDemoStateSnapshot | null;
  error?: string | null;
  createdAt: string;
  updatedAt: string;
}

export class EnterpriseDemoRuntimeContext {
  private snapshot:
    | EnterpriseDemoRuntimeContextSnapshot
    | null = null;

  initialize(
    configuration: EnterpriseDemoRuntimeConfiguration,
  ): EnterpriseDemoRuntimeContextSnapshot {
    if (!configuration.organizationId.trim()) {
      throw new Error(
        "Enterprise demo runtime organizationId is required.",
      );
    }

    if (!configuration.workspaceId.trim()) {
      throw new Error(
        "Enterprise demo runtime workspaceId is required.",
      );
    }

    if (!configuration.initiatedBy.trim()) {
      throw new Error(
        "Enterprise demo runtime initiatedBy is required.",
      );
    }

    const now = new Date().toISOString();

    this.snapshot = {
      configuration: {
        ...configuration,
        metadata: {
          ...(configuration.metadata ?? {}),
        },
      },
      status: "initializing",
      bootstrap: null,
      selectedScenario: null,
      state: null,
      error: null,
      createdAt: now,
      updatedAt: now,
    };

    return this.getSnapshot();
  }

  getSnapshot(): EnterpriseDemoRuntimeContextSnapshot {
    const snapshot = this.requireSnapshot();

    return {
      ...snapshot,
      configuration: {
        ...snapshot.configuration,
        metadata: {
          ...(snapshot.configuration.metadata ?? {}),
        },
      },
      bootstrap: snapshot.bootstrap
        ? {
            ...snapshot.bootstrap,
            registeredScenarioIds: [
              ...snapshot.bootstrap.registeredScenarioIds,
            ],
            messages: [...snapshot.bootstrap.messages],
          }
        : null,
      selectedScenario: snapshot.selectedScenario
        ? {
            ...snapshot.selectedScenario,
            tags: [...snapshot.selectedScenario.tags],
          }
        : null,
      state: snapshot.state
        ? this.cloneState(snapshot.state)
        : null,
    };
  }

  setStatus(
    status: EnterpriseDemoRuntimeStatus,
  ): EnterpriseDemoRuntimeContextSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.status = status;
    snapshot.updatedAt = new Date().toISOString();

    if (status !== "failed") {
      snapshot.error = null;
    }

    return this.getSnapshot();
  }

  setBootstrap(
    bootstrap: EnterpriseDemoBootstrapResult,
  ): EnterpriseDemoRuntimeContextSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.bootstrap = {
      ...bootstrap,
      registeredScenarioIds: [
        ...bootstrap.registeredScenarioIds,
      ],
      messages: [...bootstrap.messages],
    };
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  setSelectedScenario(
    scenario: EnterpriseDemoScenario | null,
  ): EnterpriseDemoRuntimeContextSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.selectedScenario = scenario
      ? {
          ...scenario,
          tags: [...scenario.tags],
        }
      : null;

    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  setState(
    state: EnterpriseDemoStateSnapshot,
  ): EnterpriseDemoRuntimeContextSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.state = this.cloneState(state);
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  fail(
    error: unknown,
  ): EnterpriseDemoRuntimeContextSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.status = "failed";
    snapshot.error =
      error instanceof Error
        ? error.message
        : "Unknown enterprise demo runtime error.";
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  clear(): void {
    this.snapshot = null;
  }

  private requireSnapshot():
    EnterpriseDemoRuntimeContextSnapshot {
    if (!this.snapshot) {
      throw new Error(
        "Enterprise demo runtime context has not been initialized.",
      );
    }

    return this.snapshot;
  }

  private cloneState(
    state: EnterpriseDemoStateSnapshot,
  ): EnterpriseDemoStateSnapshot {
    return {
      ...state,
      activeFlow: state.activeFlow
        ? {
            ...state.activeFlow,
            steps: state.activeFlow.steps.map((step) => ({
              ...step,
              input: step.input
                ? { ...step.input }
                : undefined,
              output: step.output
                ? { ...step.output }
                : undefined,
            })),
          }
        : null,
      sessions: state.sessions.map((session) => ({
        ...session,
        flow: session.flow
          ? {
              ...session.flow,
              steps: session.flow.steps.map((step) => ({
                ...step,
                input: step.input
                  ? { ...step.input }
                  : undefined,
                output: step.output
                  ? { ...step.output }
                  : undefined,
              })),
            }
          : null,
        metadata: {
          ...session.metadata,
        },
      })),
      diagnostics: state.diagnostics.map(
        (diagnostic) => ({
          ...diagnostic,
          details: diagnostic.details
            ? { ...diagnostic.details }
            : undefined,
        }),
      ),
      metadata: {
        ...state.metadata,
      },
    };
  }
}
