export interface CareerIntelligence {
  employeeId: string;
  currentRole: string;
  recommendedRoles: string[];
  developmentActions: string[];
}

export function hasCareerRecommendations(
  intelligence: CareerIntelligence
): boolean {
  return intelligence.recommendedRoles.length > 0;
}

export function hasDevelopmentActions(
  intelligence: CareerIntelligence
): boolean {
  return intelligence.developmentActions.length > 0;
}
