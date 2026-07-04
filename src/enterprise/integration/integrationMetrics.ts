export type IntegrationMetricsSnapshot = {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  lastExecutedAt?: Date;
};

export class IntegrationMetrics {
  private snapshot: IntegrationMetricsSnapshot = {
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
  };

  recordSuccess(executedAt: Date = new Date()): void {
    this.snapshot = {
      ...this.snapshot,
      totalExecutions: this.snapshot.totalExecutions + 1,
      successfulExecutions: this.snapshot.successfulExecutions + 1,
      lastExecutedAt: executedAt,
    };
  }

  recordFailure(executedAt: Date = new Date()): void {
    this.snapshot = {
      ...this.snapshot,
      totalExecutions: this.snapshot.totalExecutions + 1,
      failedExecutions: this.snapshot.failedExecutions + 1,
      lastExecutedAt: executedAt,
    };
  }

  getSnapshot(): IntegrationMetricsSnapshot {
    return { ...this.snapshot };
  }

  reset(): void {
    this.snapshot = {
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
    };
  }
}