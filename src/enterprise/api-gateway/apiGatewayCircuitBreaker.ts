export type ApiGatewayCircuitBreakerState =
  | "closed"
  | "open"
  | "half-open";

export interface ApiGatewayCircuitBreakerPolicy {
  id: string;
  organizationId: string;
  routeId: string;

  enabled: boolean;

  failureThreshold: number;
  recoveryTimeoutMs: number;
}

export interface ApiGatewayCircuitBreakerSnapshot {
  routeId: string;
  state: ApiGatewayCircuitBreakerState;

  failureCount: number;
  lastFailureAt?: Date;
}

export function evaluateApiGatewayCircuitBreaker(
  policy: ApiGatewayCircuitBreakerPolicy | undefined,
  snapshot: ApiGatewayCircuitBreakerSnapshot | undefined,
): ApiGatewayCircuitBreakerState {
  if (!policy || !policy.enabled || !snapshot) {
    return "closed";
  }

  if (snapshot.state === "open") {
    const canRecover =
      snapshot.lastFailureAt &&
      Date.now() - snapshot.lastFailureAt.getTime() >=
        policy.recoveryTimeoutMs;

    return canRecover ? "half-open" : "open";
  }

  if (snapshot.failureCount >= policy.failureThreshold) {
    return "open";
  }

  return snapshot.state;
}