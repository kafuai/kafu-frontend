import { EnterpriseExecutionTask, TaskReadinessAssessment } from './task-management.models';
import { TASK_READINESS_THRESHOLD } from './task-management.constants';

export class TaskReadinessEngine {
  assess(task: EnterpriseExecutionTask): TaskReadinessAssessment {
    const blockers = this.collectBlockers(task);
    const recommendations = this.collectRecommendations(task, blockers);
    const readinessScore = this.calculateReadinessScore(task, blockers);

    return {
      taskId: task.id,
      isReady: readinessScore >= TASK_READINESS_THRESHOLD && blockers.length === 0,
      readinessScore,
      blockers,
      recommendations,
    };
  }

  private collectBlockers(task: EnterpriseExecutionTask): string[] {
    const blockers: string[] = [];

    if (!task.title.trim()) {
      blockers.push('Task title is required.');
    }

    if (!task.description.trim()) {
      blockers.push('Task description is required.');
    }

    if (task.dependencies.some((dependency) => !dependency.isResolved)) {
      blockers.push('Task has unresolved dependencies.');
    }

    if (!task.owner.ownerId || !task.owner.displayName.trim()) {
      blockers.push('Task owner is incomplete.');
    }

    if (task.qualityGates.some((gate) => gate.required && gate.validationState === 'failed')) {
      blockers.push('Task has failed required quality gates.');
    }

    return blockers;
  }

  private collectRecommendations(task: EnterpriseExecutionTask, blockers: string[]): string[] {
    const recommendations: string[] = [];

    if (blockers.length > 0) {
      recommendations.push('Resolve all blockers before execution starts.');
    }

    if (task.effortEstimate.confidence < 0.6) {
      recommendations.push('Improve effort estimate confidence before committing delivery.');
    }

    if (task.executionSignals.length === 0) {
      recommendations.push('Add execution signals to improve autonomous monitoring.');
    }

    if (task.qualityGates.length === 0) {
      recommendations.push('Define quality gates before task completion.');
    }

    return recommendations;
  }

  private calculateReadinessScore(task: EnterpriseExecutionTask, blockers: string[]): number {
    const blockerPenalty = blockers.length * 0.18;
    const dependencyPenalty =
      task.dependencies.filter((dependency) => !dependency.isResolved).length * 0.12;
    const qualityGatePenalty =
      task.qualityGates.filter((gate) => gate.required && gate.validationState !== 'passed').length *
      0.08;
    const estimatePenalty = Math.max(0, 0.7 - task.effortEstimate.confidence) * 0.2;

    const score = 1 - blockerPenalty - dependencyPenalty - qualityGatePenalty - estimatePenalty;

    return Math.max(0, Math.min(1, Number(score.toFixed(3))));
  }
}