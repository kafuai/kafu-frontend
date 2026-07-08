export interface SkillIntelligence {
  employeeId: string;
  currentSkills: string[];
  requiredSkills: string[];
}

export function calculateSkillGaps(
  intelligence: SkillIntelligence
): string[] {
  return intelligence.requiredSkills.filter(
    (skill) =>
      !intelligence.currentSkills.includes(skill)
  );
}

export function hasSkillGaps(
  intelligence: SkillIntelligence
): boolean {
  return calculateSkillGaps(intelligence).length > 0;
}
