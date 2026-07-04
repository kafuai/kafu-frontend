import { OptimizationRecommendation } from "./optimizationRecommendation";

export class PerformanceRecommendationRegistry {
  private readonly recommendations = new Map<
    string,
    OptimizationRecommendation
  >();

  register(recommendation: OptimizationRecommendation): void {
    this.recommendations.set(recommendation.id, recommendation);
  }

  get(id: string): OptimizationRecommendation | undefined {
    return this.recommendations.get(id);
  }

  list(): OptimizationRecommendation[] {
    return [...this.recommendations.values()];
  }

  clear(): void {
    this.recommendations.clear();
  }
}