export interface OmnichannelRateLimitPolicy {
  readonly maximumRequests: number;
  readonly windowMs: number;
}

interface RateLimitBucket {
  readonly timestamps: number[];
}

export class OmnichannelRateLimiter {
  private readonly buckets =
    new Map<string, RateLimitBucket>();

  constructor(
    private readonly defaultPolicy:
      OmnichannelRateLimitPolicy = {
        maximumRequests: 100,
        windowMs: 60_000,
      },
    private readonly providerPolicies:
      Readonly<Record<string, OmnichannelRateLimitPolicy>> = {},
  ) {}

  consume(
    providerId: string,
  ): void {
    const policy =
      this.providerPolicies[providerId] ??
      this.defaultPolicy;

    const now = Date.now();
    const minimumTimestamp =
      now - policy.windowMs;

    const current =
      this.buckets.get(providerId)?.timestamps ?? [];

    const active = current.filter(
      (timestamp) =>
        timestamp > minimumTimestamp,
    );

    if (
      active.length >=
      policy.maximumRequests
    ) {
      throw new Error(
        `Omnichannel provider rate limit exceeded: ${providerId}`,
      );
    }

    active.push(now);

    this.buckets.set(providerId, {
      timestamps: active,
    });
  }

  remaining(
    providerId: string,
  ): number {
    const policy =
      this.providerPolicies[providerId] ??
      this.defaultPolicy;

    const now = Date.now();
    const minimumTimestamp =
      now - policy.windowMs;

    const active =
      this.buckets
        .get(providerId)
        ?.timestamps.filter(
          (timestamp) =>
            timestamp > minimumTimestamp,
        ) ?? [];

    return Math.max(
      0,
      policy.maximumRequests -
        active.length,
    );
  }
}
