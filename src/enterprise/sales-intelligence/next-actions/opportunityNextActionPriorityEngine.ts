import type {
  NextActionPriority,
} from "../salesIntelligenceConstants";

import type {
  NextActionPriorityEvaluation,
} from "./opportunityNextActionTypes";

const HOUR_IN_MILLISECONDS = 60 * 60 * 1000;

function getRemainingHours(
  dueAt: string,
  now: Date,
): number {
  return (
    new Date(dueAt).getTime() -
    now.getTime()
  ) / HOUR_IN_MILLISECONDS;
}

export function evaluateNextActionPriority(
  dueAt: string,
  requestedPriority?: NextActionPriority,
  now: Date = new Date(),
): NextActionPriorityEvaluation {
  const dueTime = new Date(dueAt).getTime();

  if (Number.isNaN(dueTime)) {
    throw new Error(
      "Next action due date must be valid.",
    );
  }

  const remainingHours = getRemainingHours(
    dueAt,
    now,
  );

  const overdue = remainingHours < 0;

  if (overdue) {
    return {
      priority: "critical",
      overdue: true,
      dueWithinHours: 0,
    };
  }

  if (remainingHours <= 24) {
    return {
      priority:
        requestedPriority === "critical"
          ? "critical"
          : "high",
      overdue: false,
      dueWithinHours: Math.ceil(
        remainingHours,
      ),
    };
  }

  if (remainingHours <= 72) {
    return {
      priority:
        requestedPriority === "critical" ||
        requestedPriority === "high"
          ? requestedPriority
          : "medium",
      overdue: false,
      dueWithinHours: Math.ceil(
        remainingHours,
      ),
    };
  }

  return {
    priority: requestedPriority ?? "medium",
    overdue: false,
    dueWithinHours: Math.ceil(
      remainingHours,
    ),
  };
}
