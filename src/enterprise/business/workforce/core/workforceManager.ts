import { EmployeeProfile } from "../models/workforceModel";
import { CreateEmployeeInput } from "../types/workforceTypes";
import { WorkforceValidator } from "../utils/workforceValidator";

export class WorkforceManager {
  private readonly validator = new WorkforceValidator();
  private readonly employees = new Map<string, EmployeeProfile>();

  create(input: CreateEmployeeInput): EmployeeProfile {
    if (!this.validator.validateCreateInput(input)) {
      throw new Error("Invalid employee input.");
    }

    const employee: EmployeeProfile = {
      ...input,
      status: "onboarding",
      hiredAt: input.hireDate ?? Date.now(),
    };

    this.employees.set(employee.id, employee);

    return employee;
  }

  get(id: string): EmployeeProfile | undefined {
    return this.employees.get(id);
  }

  list(): EmployeeProfile[] {
    return Array.from(this.employees.values());
  }

  count(): number {
    return this.employees.size;
  }
}