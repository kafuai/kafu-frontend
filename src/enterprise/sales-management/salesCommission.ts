import { SalesCommission } from "./salesManagementTypes";

export function createSalesCommission(input: {
  id: string;
  ownerId: string;
  dealId: string;
  commissionRate?: number;
  dealAmount?: number;
  status?: SalesCommission["status"];
  createdAt?: string;
  updatedAt?: string;
}): SalesCommission {
  const now = new Date().toISOString();
  const commissionRate = clampScore(input.commissionRate ?? 0);

  return {
    id: input.id,
    ownerId: input.ownerId,
    dealId: input.dealId,
    commissionRate,
    commissionAmount: Math.max(0, input.dealAmount ?? 0) * commissionRate,
    status: input.status ?? "pending",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

function clampScore(score: number): number {
  return Math.max(0, Math.min(score, 1));
}