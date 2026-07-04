export type AutomationExecutionContextStatus =
  | "initialized"
  | "running"
  | "completed"
  | "failed";

export type AutomationExecutionContext = {
  automationId: string;
  organizationId: string;
  workflowId?: string;
  status: AutomationExecutionContextStatus;
  startedAt: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
};

export function createAutomationExecutionContext(input: {
  automationId: string;
  organizationId: string;
  workflowId?: string;
  metadata?: Record<string, unknown>;
}): AutomationExecutionContext {
  return {
    automationId: input.automationId,
    organizationId: input.organizationId,
    workflowId: input.workflowId,
    status: "initialized",
    startedAt: new Date(),
    metadata: input.metadata,
  };
}