import type {
  DailyOperation,
  DailyOperationPriority,
  DailyOperationStatus,
} from "./dailyOperation";

export interface CreateDailyOperationOptions {
  id: string;
  name: string;
  domain: string;
  description: string;
  ownerRole: string;
  estimatedMinutes: number;
  priority?: DailyOperationPriority;
  status?: DailyOperationStatus;
  tags?: readonly string[];
}

export function createDailyOperation(
  options: CreateDailyOperationOptions,
): DailyOperation {
  return {
    id: options.id,
    name: options.name,
    domain: options.domain,
    description: options.description,
    ownerRole: options.ownerRole,
    estimatedMinutes: options.estimatedMinutes,
    priority: options.priority ?? "medium",
    status: options.status ?? "planned",
    dependencies: [],
    tags: options.tags ?? [],
  };
}