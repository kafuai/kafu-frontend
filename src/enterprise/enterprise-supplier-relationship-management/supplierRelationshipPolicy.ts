export interface SupplierRelationshipPolicy {
  id: string;
  name: string;
  rules: string[];
  active: boolean;
}

export function activateSupplierPolicy(
  policy: SupplierRelationshipPolicy
): SupplierRelationshipPolicy {
  return {
    ...policy,
    active: true,
  };
}

export function validateSupplierPolicy(
  policy: SupplierRelationshipPolicy
): boolean {
  return policy.rules.length > 0;
}
