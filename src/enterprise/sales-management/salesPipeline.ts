import {
  SalesManagementStatus,
  SalesPipeline,
} from "./salesManagementTypes";

export function createSalesPipeline(input: {
  id: string;
  name: string;
  description?: string;
  status?: SalesManagementStatus;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}): SalesPipeline {
  const now = new Date().toISOString();

  return {
    id: input.id,
    name: input.name,
    description: input.description,
    status: input.status ?? "active",
    ownerId: input.ownerId,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function isSalesPipelineActive(pipeline: SalesPipeline): boolean {
  return pipeline.status === "active";
}