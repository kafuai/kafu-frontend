export interface EmployeeDevelopmentPlan {
  employeeId: string;
  objectives: string[];
  skillsToDevelop: string[];
  status: "planned" | "active" | "completed";
}

export function activateDevelopmentPlan(
  plan: EmployeeDevelopmentPlan
): EmployeeDevelopmentPlan {
  return {
    ...plan,
    status: "active",
  };
}

export function completeDevelopmentPlan(
  plan: EmployeeDevelopmentPlan
): EmployeeDevelopmentPlan {
  return {
    ...plan,
    status: "completed",
  };
}
