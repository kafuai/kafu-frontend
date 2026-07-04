import {
  AIAgentGoal,
  AIAgentPlan,
  AIAgentTask,
} from "./aiAgentWorkTypes";
import {
  validateAIAgentGoal,
  validateAIAgentPlan,
  validateAIAgentTask,
} from "./aiAgentWorkValidator";

export class AIAgentWorkRegistry {
  private readonly goals = new Map<string, AIAgentGoal>();
  private readonly tasks = new Map<string, AIAgentTask>();
  private readonly plans = new Map<string, AIAgentPlan>();

  registerGoal(goal: AIAgentGoal): AIAgentGoal {
    const result = validateAIAgentGoal(goal);

    if (!result.valid) {
      throw new Error(result.errors.join(" "));
    }

    if (this.goals.has(goal.id)) {
      throw new Error(`AI agent goal already exists: ${goal.id}`);
    }

    this.goals.set(goal.id, goal);
    return goal;
  }

  registerTask(task: AIAgentTask): AIAgentTask {
    const result = validateAIAgentTask(task);

    if (!result.valid) {
      throw new Error(result.errors.join(" "));
    }

    if (this.tasks.has(task.id)) {
      throw new Error(`AI agent task already exists: ${task.id}`);
    }

    this.tasks.set(task.id, task);
    return task;
  }

  registerPlan(plan: AIAgentPlan): AIAgentPlan {
    const result = validateAIAgentPlan(plan);

    if (!result.valid) {
      throw new Error(result.errors.join(" "));
    }

    if (this.plans.has(plan.id)) {
      throw new Error(`AI agent plan already exists: ${plan.id}`);
    }

    this.plans.set(plan.id, plan);
    return plan;
  }

  getGoal(goalId: string): AIAgentGoal | undefined {
    return this.goals.get(goalId);
  }

  getTask(taskId: string): AIAgentTask | undefined {
    return this.tasks.get(taskId);
  }

  getPlan(planId: string): AIAgentPlan | undefined {
    return this.plans.get(planId);
  }

  listGoalsByAgent(agentId: string): AIAgentGoal[] {
    return Array.from(this.goals.values()).filter(
      (goal) => goal.agentId === agentId,
    );
  }

  listTasksByGoal(goalId: string): AIAgentTask[] {
    return Array.from(this.tasks.values()).filter(
      (task) => task.goalId === goalId,
    );
  }

  listPlansByGoal(goalId: string): AIAgentPlan[] {
    return Array.from(this.plans.values()).filter(
      (plan) => plan.goalId === goalId,
    );
  }

  clear(): void {
    this.goals.clear();
    this.tasks.clear();
    this.plans.clear();
  }
}