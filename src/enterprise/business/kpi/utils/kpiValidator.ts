import { KPIInput } from "../types/kpiTypes";

export class KPIValidator {
  validate(input: KPIInput): boolean {
    return Boolean(
      input.id &&
      input.organizationId &&
      input.level &&
      input.referenceId &&
      input.name &&
      input.target >= 0 &&
      input.actual >= 0,
    );
  }
}