import { AIAgentOperationTask } from "./aiAgentOperationTask";
import { assertValidAIAgentOperationTask } from "./aiAgentOperationTaskValidator";

const priorityRank: Record<AIAgentOperationTask["priority"], number> = {
  critical: 4,
  high: 3,
  normal: 2,
  low: 1,
};

export class AIAgentOperationQueue {
  private readonly tasks = new Map<string, AIAgentOperationTask>();

  enqueue(task: AIAgentOperationTask): AIAgentOperationTask {
    assertValidAIAgentOperationTask(task);

    if (this.tasks.has(task.id)) {
      throw new Error(`AI agent operation task already exists: ${task.id}`);
    }

    this.tasks.set(task.id, task);
    return task;
  }

  enqueueMany(tasks: AIAgentOperationTask[]): AIAgentOperationTask[] {
    return tasks.map((task) => this.enqueue(task));
  }

  get(taskId: string): AIAgentOperationTask | undefined {
    return this.tasks.get(taskId);
  }

  require(taskId: string): AIAgentOperationTask {
    const task = this.get(taskId);

    if (!task) {
      throw new Error(`AI agent operation task not found: ${taskId}`);
    }

    return task;
  }

  list(): AIAgentOperationTask[] {
    return Array.from(this.tasks.values());
  }

  listPending(): AIAgentOperationTask[] {
    return this.list().filter((task) => task.status === "pending");
  }

  listByPriority(): AIAgentOperationTask[] {
    return this.list().sort(
      (left, right) => priorityRank[right.priority] - priorityRank[left.priority],
    );
  }

  update(task: AIAgentOperationTask): AIAgentOperationTask {
    assertValidAIAgentOperationTask(task);

    if (!this.tasks.has(task.id)) {
      throw new Error(`AI agent operation task not found: ${task.id}`);
    }

    this.tasks.set(task.id, task);
    return task;
  }

  remove(taskId: string): boolean {
    return this.tasks.delete(taskId);
  }

  clear(): void {
    this.tasks.clear();
  }
}