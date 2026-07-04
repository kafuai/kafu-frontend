export type FailbackStatus =
  | "pending"
  | "in-progress"
  | "completed"
  | "failed";

export type FailbackRequest = {
  planId: string;
  currentSiteId: string;
  restoredPrimarySiteId: string;
  requestedBy: string;
};

export type FailbackExecution = {
  id: string;
  planId: string;
  currentSiteId: string;
  restoredPrimarySiteId: string;
  status: FailbackStatus;
  startedAt: string;
  completedAt?: string;
  validationChecks: string[];
  errors: string[];
};

function createFailbackId(): string {
  return `failback_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function startFailback(
  request: FailbackRequest,
): FailbackExecution {
  return {
    id: createFailbackId(),
    planId: request.planId,
    currentSiteId: request.currentSiteId,
    restoredPrimarySiteId: request.restoredPrimarySiteId,
    status: "in-progress",
    startedAt: new Date().toISOString(),
    validationChecks: [],
    errors: [],
  };
}

export function addFailbackValidationCheck(
  execution: FailbackExecution,
  check: string,
): FailbackExecution {
  return {
    ...execution,
    validationChecks: [...execution.validationChecks, check],
  };
}

export function completeFailback(
  execution: FailbackExecution,
): FailbackExecution {
  return {
    ...execution,
    status: "completed",
    completedAt: new Date().toISOString(),
  };
}

export function failFailback(
  execution: FailbackExecution,
  error: string,
): FailbackExecution {
  return {
    ...execution,
    status: "failed",
    completedAt: new Date().toISOString(),
    errors: [...execution.errors, error],
  };
}