export type IntegrationHealthStatus =
  | "healthy"
  | "degraded"
  | "unhealthy";

export type IntegrationHealthSnapshot = {
  status: IntegrationHealthStatus;
  checkedAt: Date;
  message?: string;
};

export class IntegrationHealth {
  private snapshot: IntegrationHealthSnapshot = {
    status: "healthy",
    checkedAt: new Date(),
  };

  update(
    status: IntegrationHealthStatus,
    message?: string,
  ): IntegrationHealthSnapshot {
    this.snapshot = {
      status,
      checkedAt: new Date(),
      message,
    };

    return this.getSnapshot();
  }

  getSnapshot(): IntegrationHealthSnapshot {
    return { ...this.snapshot };
  }
}