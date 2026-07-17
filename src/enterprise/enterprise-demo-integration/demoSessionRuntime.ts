import {
  EnterpriseDemoFlow,
  EnterpriseDemoIntegrationStatus,
} from "./demoIntegrationTypes";

export interface EnterpriseDemoSession {
  id: string;
  organizationId: string;
  workspaceId: string;
  scenarioId: string;
  status: EnterpriseDemoIntegrationStatus;
  initiatedBy: string;
  flow?: EnterpriseDemoFlow | null;
  metadata: Record<string, unknown>;
  startedAt: string;
  updatedAt: string;
  completedAt?: string | null;
}

export interface CreateEnterpriseDemoSessionInput {
  organizationId: string;
  workspaceId: string;
  scenarioId: string;
  initiatedBy: string;
  metadata?: Record<string, unknown>;
}

export class DemoSessionRuntime {
  private readonly sessions =
    new Map<string, EnterpriseDemoSession>();

  create(
    input: CreateEnterpriseDemoSessionInput,
  ): EnterpriseDemoSession {
    if (!input.organizationId.trim()) {
      throw new Error(
        "Demo session organizationId is required.",
      );
    }

    if (!input.workspaceId.trim()) {
      throw new Error(
        "Demo session workspaceId is required.",
      );
    }

    if (!input.scenarioId.trim()) {
      throw new Error(
        "Demo session scenarioId is required.",
      );
    }

    if (!input.initiatedBy.trim()) {
      throw new Error(
        "Demo session initiatedBy is required.",
      );
    }

    const now = new Date().toISOString();

    const session: EnterpriseDemoSession = {
      id: this.createSessionId(),
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      scenarioId: input.scenarioId,
      status: "ready",
      initiatedBy: input.initiatedBy,
      flow: null,
      metadata: {
        ...(input.metadata ?? {}),
      },
      startedAt: now,
      updatedAt: now,
      completedAt: null,
    };

    this.sessions.set(
      session.id,
      this.cloneSession(session),
    );

    return this.cloneSession(session);
  }

  get(id: string): EnterpriseDemoSession | null {
    const session = this.sessions.get(id);

    return session
      ? this.cloneSession(session)
      : null;
  }

  attachFlow(
    sessionId: string,
    flow: EnterpriseDemoFlow,
  ): EnterpriseDemoSession {
    const session = this.requireSession(sessionId);

    session.flow = this.cloneFlow(flow);
    session.status = flow.status;
    session.updatedAt = new Date().toISOString();

    if (
      flow.status === "completed" ||
      flow.status === "failed"
    ) {
      session.completedAt =
        flow.completedAt ??
        new Date().toISOString();
    }

    this.sessions.set(
      session.id,
      this.cloneSession(session),
    );

    return this.cloneSession(session);
  }

  updateStatus(
    sessionId: string,
    status: EnterpriseDemoIntegrationStatus,
  ): EnterpriseDemoSession {
    const session = this.requireSession(sessionId);

    session.status = status;
    session.updatedAt = new Date().toISOString();

    if (
      status === "completed" ||
      status === "failed"
    ) {
      session.completedAt =
        new Date().toISOString();
    }

    if (status === "ready" || status === "running") {
      session.completedAt = null;
    }

    this.sessions.set(
      session.id,
      this.cloneSession(session),
    );

    return this.cloneSession(session);
  }

  list(
    organizationId?: string,
  ): EnterpriseDemoSession[] {
    return Array.from(this.sessions.values())
      .filter(
        (session) =>
          !organizationId ||
          session.organizationId === organizationId,
      )
      .sort((left, right) =>
        right.startedAt.localeCompare(left.startedAt),
      )
      .map((session) =>
        this.cloneSession(session),
      );
  }

  remove(sessionId: string): boolean {
    return this.sessions.delete(sessionId);
  }

  clear(): void {
    this.sessions.clear();
  }

  count(): number {
    return this.sessions.size;
  }

  private requireSession(
    sessionId: string,
  ): EnterpriseDemoSession {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(
        `Demo session ${sessionId} was not found.`,
      );
    }

    return this.cloneSession(session);
  }

  private createSessionId(): string {
    return `demo-session-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;
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
