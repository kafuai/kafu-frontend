export type DailyOperationPriority = "low" | "medium" | "high" | "critical";

export type DailyOperationStatus =
  | "planned"
  | "ready"
  | "blocked"
  | "running"
  | "completed"
  | "failed";

export interface DailyOperationDependency {
  readonly operationId: string;
  readonly requiredStatus: DailyOperationStatus;
}

export interface DailyOperation {
  readonly id: string;
  readonly name: string;
  readonly domain: string;
  readonly description: string;
  readonly priority: DailyOperationPriority;
  readonly status: DailyOperationStatus;
  readonly ownerRole: string;
  readonly estimatedMinutes: number;
  readonly dependencies: readonly DailyOperationDependency[];
  readonly tags: readonly string[];
}