import type { TreasuryCurrency, TreasuryStatus, TreasuryAuditTrail } from "./treasuryManagementTypes";

export interface TreasuryPaymentInstruction {
  id: string;
  beneficiaryName: string;
  beneficiaryAccountMasked: string;
  amount: number;
  currency: TreasuryCurrency;
  dueDate: string;
  reference: string;
  priority: "normal" | "urgent" | "critical";
}

export interface TreasuryPaymentRun {
  id: string;
  entityId: string;
  paymentDate: string;
  instructions: TreasuryPaymentInstruction[];
  totalAmount: number;
  currency: TreasuryCurrency;
  status: TreasuryStatus;
  audit: TreasuryAuditTrail;
}

export function createTreasuryPaymentRun(input: {
  id: string;
  entityId: string;
  paymentDate: string;
  instructions: TreasuryPaymentInstruction[];
  currency: TreasuryCurrency;
  createdBy: string;
}): TreasuryPaymentRun {
  return {
    id: input.id,
    entityId: input.entityId,
    paymentDate: input.paymentDate,
    instructions: input.instructions,
    totalAmount: input.instructions.reduce((sum, item) => sum + item.amount, 0),
    currency: input.currency,
    status: "draft",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function approveTreasuryPaymentRun(
  run: TreasuryPaymentRun,
  approvedBy: string
): TreasuryPaymentRun {
  return {
    ...run,
    status: "approved",
    audit: {
      ...run.audit,
      approvedBy,
      approvedAt: new Date().toISOString(),
    },
  };
}

export function hasCriticalTreasuryPayments(run: TreasuryPaymentRun): boolean {
  return run.instructions.some((instruction) => instruction.priority === "critical");
}
