export interface WorkforceSupply {
  availableEmployees: number;
  availableSkills: string[];
}

export function hasAvailableSupply(
  supply: WorkforceSupply
): boolean {
  return supply.availableEmployees > 0;
}

export function hasSkillSupply(
  supply: WorkforceSupply,
  skill: string
): boolean {
  return supply.availableSkills.includes(skill);
}
