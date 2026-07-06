import { Department } from "../models/departmentModel";
import { CreateDepartmentInput } from "../types/departmentTypes";
import { DepartmentValidator } from "../utils/departmentValidator";

export class DepartmentManager {
  private readonly validator = new DepartmentValidator();
  private readonly departments = new Map<string, Department>();

  create(input: CreateDepartmentInput): Department {
    if (!this.validator.validateCreateInput(input)) {
      throw new Error("Invalid department input.");
    }

    const now = Date.now();

    const department: Department = {
      ...input,
      status: "active",
      createdAt: now,
      updatedAt: now,
    };

    this.departments.set(department.id, department);

    return department;
  }

  get(id: string): Department | undefined {
    return this.departments.get(id);
  }

  list(): Department[] {
    return Array.from(this.departments.values());
  }

  count(): number {
    return this.departments.size;
  }
}