export type ExecutionDependencyStatus =
  | "pending"
  | "satisfied"
  | "blocked"
  | "failed";

export interface ExecutionDependency {
  readonly id: string;
  readonly sourceExecutionId: string;
  readonly targetExecutionId: string;
  readonly requiredStatus: ExecutionDependencyStatus;
  readonly reason: string;
}

export function isExecutionDependencySatisfied(
  dependency: ExecutionDependency,
): boolean {
  return dependency.requiredStatus === "satisfied";
}