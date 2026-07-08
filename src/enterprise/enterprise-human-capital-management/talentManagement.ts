export interface TalentProfile {
  employeeId: string;
  skills: string[];
  potentialScore: number;
  performanceScore: number;
}

export function calculateTalentScore(
  talent: TalentProfile
): number {
  return Math.round(
    talent.potentialScore * 0.5 +
    talent.performanceScore * 0.5
  );
}

export function isHighPotentialTalent(
  talent: TalentProfile
): boolean {
  return calculateTalentScore(talent) >= 80;
}
