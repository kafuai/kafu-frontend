import {
  ExecutionAction,
  ExecutionPriority,
  ExecutionRiskLevel,
} from "./executionTypes";

export class ActionPlanner {
  createAction(input: {
    id: string;
    title: string;
    description: string;
    priority?: ExecutionPriority;
    riskLevel?: ExecutionRiskLevel;
  }): ExecutionAction {
    return {
      id: input.id,
      type: "recommendation",
      title: input.title,
      description: input.description,
      priority: input.priority ?? "medium",
      riskLevel: input.riskLevel ?? "low",
    };
  }
}