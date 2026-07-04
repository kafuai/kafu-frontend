import { SustainabilityMetric } from "./sustainabilityTypes";

export class SustainabilityMetricRegistry {
  private readonly metrics = new Map<string, SustainabilityMetric>();

  register(metric: SustainabilityMetric): void {
    this.metrics.set(metric.id, metric);
  }

  registerMany(metrics: SustainabilityMetric[]): void {
    metrics.forEach((metric) => this.register(metric));
  }

  findById(metricId: string): SustainabilityMetric | undefined {
    return this.metrics.get(metricId);
  }

  listByOrganization(organizationId: string): SustainabilityMetric[] {
    return Array.from(this.metrics.values()).filter(
      (metric) => metric.organizationId === organizationId,
    );
  }

  listByScope(scopeId: string): SustainabilityMetric[] {
    return Array.from(this.metrics.values()).filter(
      (metric) => metric.scopeId === scopeId,
    );
  }

  clear(): void {
    this.metrics.clear();
  }
}