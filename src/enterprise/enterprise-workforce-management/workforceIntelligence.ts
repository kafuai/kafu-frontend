export interface WorkforceIntelligence {
  insights: string[];
  recommendations: string[];
  generatedAt: string;
}

export function createWorkforceIntelligence(
  intelligence: WorkforceIntelligence
): WorkforceIntelligence {
  return {
    ...intelligence,
    generatedAt: new Date().toISOString(),
  };
}

export function hasWorkforceInsights(
  intelligence: WorkforceIntelligence
): boolean {
  return intelligence.insights.length > 0;
}
