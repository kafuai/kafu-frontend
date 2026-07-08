export interface Competency {
  id: string;
  name: string;
  category: string;
  requiredLevel: number;
}

export interface EmployeeCompetency {
  employeeId: string;
  competencyId: string;
  level: number;
}

export function hasCompetencyMatch(
  employee: EmployeeCompetency,
  competency: Competency
): boolean {
  return employee.level >= competency.requiredLevel;
}
