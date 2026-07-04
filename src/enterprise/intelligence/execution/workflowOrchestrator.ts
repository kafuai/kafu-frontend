import { ExecutionPipeline } from "./executionPipeline";
import { ExecutionPlan, ExecutionResult } from "./executionTypes";

export class WorkflowOrchestrator {
  constructor(private readonly pipeline = new ExecutionPipeline()) {}

  runWorkflow(plan: ExecutionPlan): ExecutionResult {
    return this.pipeline.run(plan);
  }
}