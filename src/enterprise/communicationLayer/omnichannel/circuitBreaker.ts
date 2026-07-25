export type OmnichannelCircuitState =
  | "closed"
  | "open"
  | "half_open";

export interface OmnichannelCircuitBreakerPolicy {
  readonly failureThreshold: number;
  readonly openDurationMs: number;
  readonly halfOpenMaximumAttempts: number;
}

export interface OmnichannelCircuitSnapshot {
  readonly providerId: string;
  readonly state: OmnichannelCircuitState;
  readonly failureCount: number;
  readonly halfOpenAttempts: number;
  readonly openedAt?: string;
  readonly updatedAt: string;
}

export class OmnichannelCircuitBreaker {
  private readonly circuits =
    new Map<string, OmnichannelCircuitSnapshot>();

  constructor(
    private readonly policy: OmnichannelCircuitBreakerPolicy = {
      failureThreshold: 5,
      openDurationMs: 30_000,
      halfOpenMaximumAttempts: 1,
    },
  ) {}

  canExecute(
    providerId: string,
  ): boolean {
    const current = this.get(providerId);

    if (current.state === "closed") {
      return true;
    }

    if (current.state === "half_open") {
      return (
        current.halfOpenAttempts <
        this.policy.halfOpenMaximumAttempts
      );
    }

    if (
      current.openedAt &&
      Date.now() -
        new Date(current.openedAt).getTime() >=
        this.policy.openDurationMs
    ) {
      this.circuits.set(providerId, {
        ...current,
        state: "half_open",
        halfOpenAttempts: 0,
        updatedAt: new Date().toISOString(),
      });

      return true;
    }

    return false;
  }

  recordSuccess(
    providerId: string,
  ): OmnichannelCircuitSnapshot {
    const snapshot: OmnichannelCircuitSnapshot = {
      providerId,
      state: "closed",
      failureCount: 0,
      halfOpenAttempts: 0,
      updatedAt: new Date().toISOString(),
    };

    this.circuits.set(providerId, snapshot);

    return snapshot;
  }

  recordFailure(
    providerId: string,
  ): OmnichannelCircuitSnapshot {
    const current = this.get(providerId);
    const failureCount =
      current.failureCount + 1;

    const shouldOpen =
      failureCount >= this.policy.failureThreshold ||
      current.state === "half_open";

    const now = new Date().toISOString();

    const snapshot: OmnichannelCircuitSnapshot = {
      providerId,
      state: shouldOpen ? "open" : current.state,
      failureCount,
      halfOpenAttempts:
        current.state === "half_open"
          ? current.halfOpenAttempts + 1
          : current.halfOpenAttempts,
      openedAt: shouldOpen
        ? now
        : current.openedAt,
      updatedAt: now,
    };

    this.circuits.set(providerId, snapshot);

    return snapshot;
  }

  get(
    providerId: string,
  ): OmnichannelCircuitSnapshot {
    return (
      this.circuits.get(providerId) ?? {
        providerId,
        state: "closed",
        failureCount: 0,
        halfOpenAttempts: 0,
        updatedAt: new Date().toISOString(),
      }
    );
  }
}
