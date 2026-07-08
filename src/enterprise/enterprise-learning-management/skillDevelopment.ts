export interface SkillDevelopment {
  employeeId: string;
  currentSkills: string[];
  targetSkills: string[];
}

export function calculateSkillGap(
  development: SkillDevelopment
): string[] {
  return development.targetSkills.filter(
    (skill) =>
      !development.currentSkills.includes(skill)
  );
}

export function hasSkillGap(
  development: SkillDevelopment
): boolean {
  return calculateSkillGap(development).length > 0;
}
