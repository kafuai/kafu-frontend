import { AIAgentTask } from "./aiAgentWorkTypes";
import { scheduleAIAgentTasks } from "./aiAgentScheduler";

export class AIAgentTaskQueue {
  private readonly tasks = new Map<string, AIAgentTask>();

  enqueue(task: AIAgentTask): AIAgentTask {
    this.tasks.set(task.id, task);
    return task;
  }

  dequeue(): AIAgentTask | undefined {
    const [nextTask] = scheduleAIAgentTasks(this.list());

    if (!nextTask) {
      return undefined;
    }

    this.tasks.delete(nextTask.id);
    return nextTask;
  }

  list(): AIAgentTask[] {
    return Array.from(this.tasks.values());
  }

  size(): number {
    return this.tasks.size;
  }

  clear(): void {
    this.tasks.clear();
  }
}