import {
  EnterpriseDemoDiagnostic,
  EnterpriseDemoFlow,
  EnterpriseDemoIntegrationStatus,
} from "./demoIntegrationTypes";
import {
  EnterpriseDemoSession,
} from "./demoSessionRuntime";

export interface EnterpriseDemoStateSnapshot {
  organizationId: string;
  workspaceId: string;
  status: EnterpriseDemoIntegrationStatus;
  activeSessionId?: string | null;
  activeScenarioId?: string | null;
  activeFlow?: EnterpriseDemoFlow | null;
  sessions: EnterpriseDemoSession[];
  diagnostics: EnterpriseDemoDiagnostic[];
  metadata: Record<string, unknown>;
  updatedAt: string;
}

export interface InitializeEnterpriseDemoStateInput {
  organizationId: string;
  workspaceId: string;
  metadata?: Record<string, unknown>;
}

export class DemoState {
  private snapshot:
    | EnterpriseDemoStateSnapshot
    | null = null;

  initialize(
    input: InitializeEnterpriseDemoStateInput,
  ): EnterpriseDemoStateSnapshot {
    if (!input.organizationId.trim()) {
      throw new Error(
        "Demo state organizationId is required.",
      );
    }

    if (!input.workspaceId.trim()) {
      throw new Error(
        "Demo state workspaceId is required.",
      );
    }

    this.snapshot = {
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      status: "ready",
      activeSessionId: null,
      activeScenarioId: null,
      activeFlow: null,
      sessions: [],
      diagnostics: [],
      metadata: {
        ...(input.metadata ?? {}),
      },
      updatedAt: new Date().toISOString(),
    };

    return this.getSnapshot();
  }

  getSnapshot(): EnterpriseDemoStateSnapshot {
    if (!this.snapshot) {
      throw new Error(
        "Demo state has not been initialized.",
      );
    }

    return this.cloneSnapshot(this.snapshot);
  }

  setStatus(
    status: EnterpriseDemoIntegrationStatus,
  ): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.status = status;
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  setActiveSession(
    session: EnterpriseDemoSession,
  ): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.activeSessionId = session.id;
    snapshot.activeScenarioId =
      session.scenarioId;
    snapshot.activeFlow = session.flow
      ? this.cloneFlow(session.flow)
      : null;

    const index = snapshot.sessions.findIndex(
      (item) => item.id === session.id,
    );

    if (index >= 0) {
      snapshot.sessions[index] =
        this.cloneSession(session);
    } else {
      snapshot.sessions.push(
        this.cloneSession(session),
      );
    }

    snapshot.status = session.status;
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  setActiveFlow(
    flow: EnterpriseDemoFlow,
  ): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.activeFlow =
      this.cloneFlow(flow);
    snapshot.activeScenarioId =
      flow.scenarioId;
    snapshot.status = flow.status;
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  addDiagnostic(
    diagnostic: EnterpriseDemoDiagnostic,
  ): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.diagnostics.push({
      ...diagnostic,
      details: diagnostic.details
        ? { ...diagnostic.details }
        : undefined,
    });

    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  updateMetadata(
    metadata: Record<string, unknown>,
  ): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.metadata = {
      ...snapshot.metadata,
      ...metadata,
    };

    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  clearActiveContext(): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.activeSessionId = null;
    snapshot.activeScenarioId = null;
    snapshot.activeFlow = null;
    snapshot.status = "ready";
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  reset(): EnterpriseDemoStateSnapshot {
    const snapshot = this.requireSnapshot();

    snapshot.status = "ready";
    snapshot.activeSessionId = null;
    snapshot.activeScenarioId = null;
    snapshot.activeFlow = null;
    snapshot.sessions = [];
    snapshot.diagnostics = [];
    snapshot.updatedAt = new Date().toISOString();

    return this.getSnapshot();
  }

  private requireSnapshot():
    EnterpriseDemoStateSnapshot {
    if (!this.snapshot) {
      throw new Error(
        "Demo state has not been initialized.",
      );
    }

    return this.snapshot;
  }

  private cloneSnapshot(
    snapshot: EnterpriseDemoStateSnapshot,
  ): EnterpriseDemoStateSnapshot {
    return {
      ...snapshot,
      activeFlow: snapshot.activeFlow
        ? this.cloneFlow(snapshot.activeFlow)
        : null,
      sessions: snapshot.sessions.map((session) =>
        this.cloneSession(session),
      ),
      diagnostics: snapshot.diagnostics.map(
        (diagnostic) => ({
          ...diagnostic,
          details: diagnostic.details
            ? { ...diagnostic.details }
            : undefined,
        }),
      ),
      metadata: {
        ...snapshot.metadata,
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
