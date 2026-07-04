import {
  AIAgentOperationMetadata,
  AIAgentOperationPriority,
  AIAgentOperationTaskStatus,
} from "./aiAgentOperationTypes";

export interface AIAgentOperationTask {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  capabilityId: string;
  requiredAgentId?: string;
  input: Record<string, unknown>;
  priority: AIAgentOperationPriority;
  status: AIAgentOperationTaskStatus;
  dependencies: string[];
  metadata: AIAgentOperationMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAIAgentOperationTaskInput {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  capabilityId: string;
  requiredAgentId?: string;
  input?: Record<string, unknown>;
  priority?: AIAgentOperationPriority;
  dependencies?: string[];
  metadata?: AIAgentOperationMetadata;
}

export function createAIAgentOperationTask(
  input: CreateAIAgentOperationTaskInput,
): AIAgentOperationTask {
  const now = new Date();

  return {
    id: input.id,
    organizationId: input.organizationId,
    title: input.title,
    description: input.description,
    capabilityId: input.capabilityId,
    requiredAgentId: input.requiredAgentId,
    input: input.input ?? {},
    priority: input.priority ?? "normal",
    status: "pending",
    dependencies: input.dependencies ?? [],
    metadata: input.metadata ?? {},
    createdAt: now,
    updatedAt: now,
  };
}

export function updateAIAgentOperationTaskStatus(
  task: AIAgentOperationTask,
  status: AIAgentOperationTaskStatus,
): AIAgentOperationTask {
  return {
    ...task,
    status,
    updatedAt: new Date(),
  };
}