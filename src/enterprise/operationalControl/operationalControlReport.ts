import type { OperationalControl } from "./operationalControl";
import {
  calculateOperationalControlMetrics,
  type OperationalControlMetrics,
} from "./operationalControlMetrics";

export interface OperationalControlReport {
  readonly id: string;
  readonly generatedAt: string;
  readonly metrics: OperationalControlMetrics;
  readonly blockingControlIds: readonly string[];
  readonly criticalControlIds: readonly string[];
}

export function createOperationalControlReport(
  id: string,
  generatedAt: string,
  controls: readonly OperationalControl[],
): OperationalControlReport {
  return {
    id,
    generatedAt,
    metrics: calculateOperationalControlMetrics(controls),
    blockingControlIds: controls
      .filter(
        (control) =>
          control.status === "blocked" || control.severity === "critical",
      )
      .map((control) => control.id),
    criticalControlIds: controls
      .filter((control) => control.severity === "critical")
      .map((control) => control.id),
  };
}