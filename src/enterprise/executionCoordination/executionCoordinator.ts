export type ExecutionCoordinatorType = "human" | "ai-agent" | "team" | "system";

export interface ExecutionCoordinator {
  readonly id: string;
  readonly name: string;
  readonly type: ExecutionCoordinatorType;
  readonly capability: string;
  readonly available: boolean;
}