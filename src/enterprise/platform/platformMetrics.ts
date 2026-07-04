export type PlatformMetric = {
  name: string;
  value: number;
  recordedAt: Date;
};

export class PlatformMetrics {
  private readonly metrics: PlatformMetric[] = [];

  record(name: string, value: number): void {
    this.metrics.push({
      name,
      value,
      recordedAt: new Date(),
    });
  }

  list(): PlatformMetric[] {
    return [...this.metrics];
  }

  latest(name: string): PlatformMetric | undefined {
    return [...this.metrics]
      .reverse()
      .find((metric) => metric.name === name);
  }
}