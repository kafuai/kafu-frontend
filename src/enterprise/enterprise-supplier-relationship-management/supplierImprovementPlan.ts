export interface SupplierImprovementPlan {
  supplierId: string;
  objectives: string[];
  actions: string[];
  status: "open" | "progress" | "completed";
}

export function createImprovementPlan(
  supplierId: string,
  objectives: string[]
): SupplierImprovementPlan {
  return {
    supplierId,
    objectives,
    actions: [],
    status: "open",
  };
}

export function completeImprovementPlan(
  plan: SupplierImprovementPlan
): SupplierImprovementPlan {
  return {
    ...plan,
    status: "completed",
  };
}
