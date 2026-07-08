export interface SupplierQualificationRequirement {
  id: string;
  name: string;
  required: boolean;
  passed: boolean;
}

export function isSupplierQualified(
  requirements: SupplierQualificationRequirement[]
): boolean {
  return requirements
    .filter((item) => item.required)
    .every((item) => item.passed);
}

export function getMissingRequirements(
  requirements: SupplierQualificationRequirement[]
): SupplierQualificationRequirement[] {
  return requirements.filter(
    (item) => item.required && !item.passed
  );
}
