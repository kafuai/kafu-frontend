export interface CareerPath {
  employeeId: string;
  currentRole: string;
  nextRoles: string[];
  developmentAreas: string[];
}

export function hasCareerPath(
  career: CareerPath
): boolean {
  return career.nextRoles.length > 0;
}

export function countDevelopmentAreas(
  career: CareerPath
): number {
  return career.developmentAreas.length;
}
