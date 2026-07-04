import { SchedulingExecutionEngine } from "./schedulingExecutionEngine";
import { SchedulingJobHistory } from "./schedulingJobHistory";
import { SchedulingJobRegistry } from "./schedulingJobRegistry";
import { SchedulingQueue } from "./schedulingQueue";
import { SchedulingService } from "./schedulingService";

export type SchedulingRuntime = {
  registry: SchedulingJobRegistry;
  queue: SchedulingQueue;
  engine: SchedulingExecutionEngine;
  history: SchedulingJobHistory;
  service: SchedulingService;
};

export function createSchedulingRuntime(): SchedulingRuntime {
  const registry = new SchedulingJobRegistry();
  const queue = new SchedulingQueue();
  const engine = new SchedulingExecutionEngine();
  const history = new SchedulingJobHistory();

  const service = new SchedulingService(
    registry,
    queue,
    engine,
    history,
  );

  return {
    registry,
    queue,
    engine,
    history,
    service,
  };
}