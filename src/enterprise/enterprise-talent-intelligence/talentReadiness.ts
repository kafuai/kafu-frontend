export interface TalentReadiness {
  employeeId: string;
  targetRole: string;
  readinessScore: number;
}

export function isTalentReady(
  readiness: TalentReadiness
): boolean {
  return readiness.readinessScore >= 75;
}
