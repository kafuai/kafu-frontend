export interface EmployeeIntelligence {
  employeeId: string;
  skills: string[];
  insights: string[];
  recommendations: string[];
}

export function hasEmployeeInsights(
  intelligence: EmployeeIntelligence
): boolean {
  return intelligence.insights.length > 0;
}

export function hasRecommendations(
  intelligence: EmployeeIntelligence
): boolean {
  return intelligence.recommendations.length > 0;
}
