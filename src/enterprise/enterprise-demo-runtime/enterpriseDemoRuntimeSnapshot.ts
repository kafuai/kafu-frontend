import {
  EnterpriseDemoFlow,
  EnterpriseDemoSession,
  EnterpriseDemoStateSnapshot,
} from "../enterprise-demo-integration";
import {
  EnterpriseDemoRuntimeStatus,
} from "./enterpriseDemoRuntimeTypes";

export interface EnterpriseDemoRuntimeSnapshot {
  organizationId: string;
  workspaceId: string;
  status: EnterpriseDemoRuntimeStatus;
  activeSessionId?: string | null;
  activeScenarioId?: string | null;
  activeFlow?: EnterpriseDemoFlow | null;
  sessions: EnterpriseDemoSession[];
  state: EnterpriseDemoStateSnapshot;
  capturedAt: string;
}

export class EnterpriseDemoRuntimeSnapshotBuilder {
  build(
    state: EnterpriseDemoStateSnapshot,
    status: EnterpriseDemoRuntimeStatus,
  ): EnterpriseDemoRuntimeSnapshot {
    return {
      organizationId: state.organizationId,
      workspaceId: state.workspaceId,
      status,
      activeSessionId:
        state.activeSessionId ?? null,
      activeScenarioId:
        state.activeScenarioId ?? null,
      activeFlow: state.activeFlow
        ? this.cloneFlow(state.activeFlow)
        : null,
      sessions: state.sessions.map((session) =>
        this.cloneSession(session),
      ),
      state: this.cloneState(state),
      capturedAt: new Date().toISOString(),
    };
  }

  private cloneState(
    state: EnterpriseDemoStateSnapshot,
  ): EnterpriseDemoStateSnapshot {
    return {
      ...state,
      activeFlow: state.activeFlow
        ? this.cloneFlow(state.activeFlow)
        : null,
      sessions: state.sessions.map((session) =>
        this.cloneSession(session),
      ),
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

  private cloneSession(
    session: EnterpriseDemoSession,
  ): EnterpriseDemoSession {
    return {
      ...session,
      flow: session.flow
        ? this.cloneFlow(session.flow)
        : null,
      metadata: {
        ...session.metadata,
      },
    };
  }

  private cloneFlow(
    flow: EnterpriseDemoFlow,
  ): EnterpriseDemoFlow {
    return {
      ...flow,
      steps: flow.steps.map((step) => ({
        ...step,
        input: step.input
          ? { ...step.input }
          : undefined,
        output: step.output
          ? { ...step.output }
          : undefined,
      })),
    };
  }
}
