export interface WorkforceOptimizationResult {
  area: string;
  improvementPercentage: number;
  recommendations: string[];
}

export function hasOptimizationOpportunity(
  result: WorkforceOptimizationResult
): boolean {
  return result.improvementPercentage > 0;
}
