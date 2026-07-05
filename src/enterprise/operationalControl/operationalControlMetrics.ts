import type { OperationalControl } from "./operationalControl";

export interface OperationalControlMetrics {
  readonly totalControls: number;
  readonly activeControls: number;
  readonly blockedControls: number;
  readonly criticalControls: number;
}

export function calculateOperationalControlMetrics(
  controls: readonly OperationalControl[],
): OperationalControlMetrics {
  return {
    totalControls: controls.length,
    activeControls: controls.filter((control) => control.status === "active").length,
    blockedControls: controls.filter((control) => control.status === "blocked").length,
    criticalControls: controls.filter((control) => control.severity === "critical").length,
  };
}