import {
  AIOrchestrationPriority,
  AIOrchestrationStatus,
  AIOrchestrationStep,
  AIOrchestrationWorkflow,
} from "./aiOrchestrationTypes";

export interface CreateAIOrchestrationWorkflowInput {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  objective: string;
  version: string;
  priority?: AIOrchestrationPriority;
  status?: AIOrchestrationStatus;
  steps?: AIOrchestrationStep[];
  createdBy: string;
  ownerTeam: string;
  tags?: string[];
}

export function createAIOrchestrationWorkflow(
  input: CreateAIOrchestrationWorkflowInput,
): AIOrchestrationWorkflow {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    name: input.name,
    description: input.description,
    objective: input.objective,
    version: input.version,
    priority: input.priority ?? "normal",
    status: input.status ?? "draft",
    steps: input.steps ?? [],
    metadata: {
      createdAt: now,
      updatedAt: now,
      createdBy: input.createdBy,
      ownerTeam: input.ownerTeam,
      tags: input.tags ?? [],
    },
  };
}

export function activateAIOrchestrationWorkflow(
  workflow: AIOrchestrationWorkflow,
): AIOrchestrationWorkflow {
  return {
    ...workflow,
    status: "active",
    metadata: {
      ...workflow.metadata,
      updatedAt: new Date(),
    },
  };
}

export function pauseAIOrchestrationWorkflow(
  workflow: AIOrchestrationWorkflow,
): AIOrchestrationWorkflow {
  return {
    ...workflow,
    status: "paused",
    metadata: {
      ...workflow.metadata,
      updatedAt: new Date(),
    },
  };
}

export function archiveAIOrchestrationWorkflow(
  workflow: AIOrchestrationWorkflow,
): AIOrchestrationWorkflow {
  return {
    ...workflow,
    status: "archived",
    metadata: {
      ...workflow.metadata,
      updatedAt: new Date(),
    },
  };
}