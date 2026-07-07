export type CommandCenterExecutionLinkStatus =
  | "draft"
  | "linked"
  | "active"
  | "paused"
  | "completed"
  | "failed";

export type CommandCenterExecutionLinkPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface CommandCenterExecutionLink {
  id: string;
  commandCenterId: string;
  executionId: string;
  title: string;
  status: CommandCenterExecutionLinkStatus;
  priority: CommandCenterExecutionLinkPriority;
  owner: string;
  createdAt: string;
  updatedAt: string;
}