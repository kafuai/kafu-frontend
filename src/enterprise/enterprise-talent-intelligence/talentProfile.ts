export interface TalentProfile {
  employeeId: string;
  skills: string[];
  strengths: string[];
  growthAreas: string[];
}

export function hasTalentStrengths(
  profile: TalentProfile
): boolean {
  return profile.strengths.length > 0;
}

export function countGrowthAreas(
  profile: TalentProfile
): number {
  return profile.growthAreas.length;
}
