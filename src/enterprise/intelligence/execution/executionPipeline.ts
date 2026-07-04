import { ExecutionEngine } from "./executionEngine";
import { ExecutionMonitor } from "./executionMonitor";
import { ExecutionValidator } from "./executionValidator";
import { ExecutionPlan, ExecutionResult } from "./executionTypes";

export class ExecutionPipeline {
  constructor(
    private readonly engine = new ExecutionEngine(),
    private readonly validator = new ExecutionValidator(),
    private readonly monitor = new ExecutionMonitor(),
  ) {}

  run(plan: ExecutionPlan): ExecutionResult {
    const validation = this.validator.validate(plan);

    if (!validation.valid) {
      const result: ExecutionResult = {
        planId: plan.id,
        status: "failed",
        completedActions: [],
        failedActions: plan.actions.map((action) => action.id),
        summary: validation.errors.join(" "),
        executedAt: new Date(),
      };

      this.monitor.capture(plan, result);
      return result;
    }

    if (plan.actions.length === 0) {
      const result: ExecutionResult = {
        planId: plan.id,
        status: "completed",
        completedActions: [],
        failedActions: [],
        summary: `Execution skipped for "${plan.title}" because no actions were provided.`,
        executedAt: new Date(),
      };

      this.monitor.capture(plan, result);
      return result;
    }

    const result = this.engine.execute(plan);
    this.monitor.capture(plan, result);

    return result;
  }
}