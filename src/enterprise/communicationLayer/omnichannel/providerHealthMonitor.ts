import type {
  OmnichannelProviderStatus,
} from "./omnichannelModels";

export interface OmnichannelProviderHealthSnapshot {
  readonly providerId: string;
  readonly status: OmnichannelProviderStatus;
  readonly successfulDeliveries: number;
  readonly failedDeliveries: number;
  readonly consecutiveFailures: number;
  readonly lastSuccessAt?: string;
  readonly lastFailureAt?: string;
  readonly updatedAt: string;
}

export interface OmnichannelProviderHealthPolicy {
  readonly degradedFailureThreshold: number;
  readonly unavailableFailureThreshold: number;
}

export class OmnichannelProviderHealthMonitor {
  private readonly snapshots =
    new Map<string, OmnichannelProviderHealthSnapshot>();

  constructor(
    private readonly policy: OmnichannelProviderHealthPolicy = {
      degradedFailureThreshold: 3,
      unavailableFailureThreshold: 5,
    },
  ) {
    if (
      policy.degradedFailureThreshold < 1 ||
      policy.unavailableFailureThreshold <
        policy.degradedFailureThreshold
    ) {
      throw new Error(
        "Invalid omnichannel provider health policy.",
      );
    }
  }

  recordSuccess(
    providerId: string,
  ): OmnichannelProviderHealthSnapshot {
    const current = this.get(providerId);
    const now = new Date().toISOString();

    const snapshot: OmnichannelProviderHealthSnapshot = {
      ...current,
      status: "healthy",
      successfulDeliveries:
        current.successfulDeliveries + 1,
      consecutiveFailures: 0,
      lastSuccessAt: now,
      updatedAt: now,
    };

    this.snapshots.set(providerId, snapshot);

    return snapshot;
  }

  recordFailure(
    providerId: string,
  ): OmnichannelProviderHealthSnapshot {
    const current = this.get(providerId);
    const now = new Date().toISOString();
    const consecutiveFailures =
      current.consecutiveFailures + 1;

    const status: OmnichannelProviderStatus =
      consecutiveFailures >=
      this.policy.unavailableFailureThreshold
        ? "unavailable"
        : consecutiveFailures >=
            this.policy.degradedFailureThreshold
          ? "degraded"
          : current.status === "disabled"
            ? "disabled"
            : "healthy";

    const snapshot: OmnichannelProviderHealthSnapshot = {
      ...current,
      status,
      failedDeliveries:
        current.failedDeliveries + 1,
      consecutiveFailures,
      lastFailureAt: now,
      updatedAt: now,
    };

    this.snapshots.set(providerId, snapshot);

    return snapshot;
  }

  setStatus(
    providerId: string,
    status: OmnichannelProviderStatus,
  ): OmnichannelProviderHealthSnapshot {
    const current = this.get(providerId);

    const snapshot: OmnichannelProviderHealthSnapshot = {
      ...current,
      status,
      updatedAt: new Date().toISOString(),
    };

    this.snapshots.set(providerId, snapshot);

    return snapshot;
  }

  get(
    providerId: string,
  ): OmnichannelProviderHealthSnapshot {
    return (
      this.snapshots.get(providerId) ?? {
        providerId,
        status: "healthy",
        successfulDeliveries: 0,
        failedDeliveries: 0,
        consecutiveFailures: 0,
        updatedAt: new Date().toISOString(),
      }
    );
  }

  list():
    readonly OmnichannelProviderHealthSnapshot[] {
    return [...this.snapshots.values()];
  }
}
