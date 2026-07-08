export interface EmployeeProfile {
  employeeId: string;
  fullName: string;
  email: string;
  department: string;
  position: string;
  skills: string[];
}

export function createEmployeeProfile(
  profile: EmployeeProfile
): EmployeeProfile {
  return {
    ...profile,
    skills: [...new Set(profile.skills)],
  };
}

export function hasEmployeeSkill(
  profile: EmployeeProfile,
  skill: string
): boolean {
  return profile.skills.includes(skill);
}
