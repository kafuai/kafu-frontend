import {
  EnterpriseExecutionTask,
  TaskExecutionAssessment,
  TaskManagementSummary,
  TaskReadinessAssessment,
} from './task-management.models';
import { TaskExecutionAssessor } from './task-execution-assessor';
import { TaskReadinessEngine } from './task-readiness.engine';

export class TaskManagementService {
  private readonly readinessEngine = new TaskReadinessEngine();
  private readonly executionAssessor = new TaskExecutionAssessor();

  assessReadiness(task: EnterpriseExecutionTask): TaskReadinessAssessment {
    return this.readinessEngine.assess(task);
  }

  assessExecution(task: EnterpriseExecutionTask): TaskExecutionAssessment {
    return this.executionAssessor.assess(task);
  }

  summarize(tasks: EnterpriseExecutionTask[]): TaskManagementSummary {
    const readiness = tasks.map((task) => this.assessReadiness(task));
    const execution = tasks.map((task) => this.assessExecution(task));

    return {
      totalTasks: tasks.length,
      readyTasks: readiness.filter((item) => item.isReady).length,
      blockedTasks: tasks.filter((task) => task.status === 'blocked').length,
      inProgressTasks: tasks.filter((task) => task.status === 'in_progress').length,
      completedTasks: tasks.filter((task) => task.status === 'completed').length,
      criticalTasks: tasks.filter((task) => task.priority === 'critical').length,
      averageReadinessScore: this.average(
        readiness.map((item) => item.readinessScore),
      ),
      averageDeliveryConfidence: this.average(
        execution.map((item) => item.deliveryConfidence),
      ),
    };
  }

  private average(values: number[]): number {
    if (values.length === 0) {
      return 0;
    }

    const total = values.reduce((sum, value) => sum + value, 0);

    return Number((total / values.length).toFixed(3));
  }
}