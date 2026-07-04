export type FailoverStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed";

export type FailoverRequest = {
  planId: string;
  sourceSiteId: string;
  targetSiteId: string;
  reason: string;
  requestedBy: string;
};

export type FailoverExecution = {
  id: string;
  planId: string;
  sourceSiteId: string;
  targetSiteId: string;
  status: FailoverStatus;
  reason: string;
  requestedBy: string;
  startedAt: string;
  completedAt?: string;
  errors: string[];
};

function createFailoverId(): string {
  return `failover_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function startFailover(
  request: FailoverRequest,
): FailoverExecution {
  return {
    id: createFailoverId(),
    planId: request.planId,
    sourceSiteId: request.sourceSiteId,
    targetSiteId: request.targetSiteId,
    status: "in-progress",
    reason: request.reason,
    requestedBy: request.requestedBy,
    startedAt: new Date().toISOString(),
    errors: [],
  };
}

export function completeFailover(
  execution: FailoverExecution,
): FailoverExecution {
  return {
    ...execution,
    status: "completed",
    completedAt: new Date().toISOString(),
  };
}

export function failFailover(
  execution: FailoverExecution,
  error: string,
): FailoverExecution {
  return {
    ...execution,
    status: "failed",
    completedAt: new Date().toISOString(),
    errors: [...execution.errors, error],
  };
}