import type { OperationalControl } from "./operationalControl";
import {
  satisfiesOperationalControlPolicy,
  type OperationalControlPolicy,
} from "./operationalControlPolicy";

export type OperationalControlDecision =
  | "approved"
  | "denied"
  | "requires_review";

export interface OperationalControlDecisionResult {
  readonly controlId: string;
  readonly decision: OperationalControlDecision;
  readonly reasons: readonly string[];
}

export function evaluateOperationalControlDecision(
  control: OperationalControl,
  policy: OperationalControlPolicy,
): OperationalControlDecisionResult {
  const reasons: string[] = [];

  if (policy.requireActiveControls && control.status !== "active") {
    reasons.push("Operational control is not active.");
  }

  if (!policy.allowCriticalControls && control.severity === "critical") {
    reasons.push("Critical operational controls require review.");
  }

  if (
    policy.allowedOwners !== undefined &&
    !policy.allowedOwners.includes(control.owner)
  ) {
    reasons.push("Operational control owner is not allowed by policy.");
  }

  if (reasons.length === 0) {
    return {
      controlId: control.id,
      decision: "approved",
      reasons: [],
    };
  }

  if (satisfiesOperationalControlPolicy(control, policy)) {
    return {
      controlId: control.id,
      decision: "requires_review",
      reasons,
    };
  }

  return {
    controlId: control.id,
    decision: "denied",
    reasons,
  };
}