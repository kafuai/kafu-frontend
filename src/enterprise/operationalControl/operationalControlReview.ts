import type { OperationalControl } from "./operationalControl";

export interface OperationalControlReviewFinding {
  readonly id: string;
  readonly controlId: string;
  readonly severity: "low" | "medium" | "high" | "critical";
  readonly description: string;
  readonly recommendedAction: string;
}

export function createOperationalControlReviewFindings(
  controls: readonly OperationalControl[],
): readonly OperationalControlReviewFinding[] {
  return controls
    .filter(
      (control) =>
        control.status === "blocked" || control.severity === "critical",
    )
    .map((control) => ({
      id: `${control.id}:review`,
      controlId: control.id,
      severity: control.severity === "critical" ? "critical" : "high",
      description: `Operational control "${control.name}" requires review.`,
      recommendedAction:
        control.status === "blocked"
          ? "Resolve blocking condition before continuing execution."
          : "Review critical control impact before approval.",
    }));
}