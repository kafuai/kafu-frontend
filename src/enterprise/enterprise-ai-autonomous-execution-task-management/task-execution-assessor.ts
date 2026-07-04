import { EnterpriseExecutionTask, TaskExecutionAssessment } from './task-management.models';
import {
  TASK_CRITICAL_RISK_THRESHOLD,
  TASK_DELIVERY_CONFIDENCE_THRESHOLD,
} from './task-management.constants';
import { TaskStatus } from './task-management.types';

export class TaskExecutionAssessor {
  assess(task: EnterpriseExecutionTask): TaskExecutionAssessment {
    const executionScore = this.calculateExecutionScore(task);
    const riskScore = this.calculateRiskScore(task);
    const qualityScore = this.calculateQualityScore(task);
    const deliveryConfidence = this.calculateDeliveryConfidence(
      executionScore,
      riskScore,
      qualityScore,
      task.effortEstimate.confidence,
    );

    return {
      taskId: task.id,
      executionScore,
      riskScore,
      qualityScore,
      deliveryConfidence,
      recommendedStatus: this.recommendStatus(task, deliveryConfidence, riskScore),
    };
  }

  private calculateExecutionScore(task: EnterpriseExecutionTask): number {
    if (task.executionSignals.length === 0) {
      return 0.4;
    }

    const weightedTotal = task.executionSignals.reduce(
      (total, signal) => total + signal.value * signal.weight,
      0,
    );

    const weightTotal = task.executionSignals.reduce((total, signal) => total + signal.weight, 0);

    if (weightTotal <= 0) {
      return 0.4;
    }

    return this.normalize(weightedTotal / weightTotal);
  }

  private calculateRiskScore(task: EnterpriseExecutionTask): number {
    const baseRiskByLevel: Record<string, number> = {
      none: 0,
      low: 0.2,
      medium: 0.45,
      high: 0.7,
      critical: 0.9,
    };

    const unresolvedDependencyImpact =
      task.dependencies.filter((dependency) => !dependency.isResolved).length * 0.08;

    const failedGateImpact =
      task.qualityGates.filter((gate) => gate.required && gate.validationState === 'failed').length *
      0.12;

    return this.normalize((baseRiskByLevel[task.riskLevel] ?? 0.45) + unresolvedDependencyImpact + failedGateImpact);
  }

  private calculateQualityScore(task: EnterpriseExecutionTask): number {
    const requiredGates = task.qualityGates.filter((gate) => gate.required);

    if (requiredGates.length === 0) {
      return 0.6;
    }

    const passedGates = requiredGates.filter((gate) => gate.validationState === 'passed').length;

    return this.normalize(passedGates / requiredGates.length);
  }

  private calculateDeliveryConfidence(
    executionScore: number,
    riskScore: number,
    qualityScore: number,
    effortConfidence: number,
  ): number {
    const confidence =
      executionScore * 0.35 + (1 - riskScore) * 0.25 + qualityScore * 0.25 + effortConfidence * 0.15;

    return this.normalize(confidence);
  }

  private recommendStatus(
    task: EnterpriseExecutionTask,
    deliveryConfidence: number,
    riskScore: number,
  ): TaskStatus {
    if (task.status === 'completed' || task.status === 'cancelled') {
      return task.status;
    }

    if (riskScore >= TASK_CRITICAL_RISK_THRESHOLD) {
      return 'blocked';
    }

    if (deliveryConfidence >= TASK_DELIVERY_CONFIDENCE_THRESHOLD) {
      return 'in_progress';
    }

    return 'under_review';
  }

  private normalize(value: number): number {
    return Math.max(0, Math.min(1, Number(value.toFixed(3))));
  }
}