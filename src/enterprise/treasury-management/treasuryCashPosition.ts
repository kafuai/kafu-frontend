import type { TreasuryCashPosition, TreasuryCurrency, TreasuryStatus } from "./treasuryManagementTypes";

export function createTreasuryCashPosition(input: {
  id: string;
  entityId: string;
  accountId: string;
  currency: TreasuryCurrency;
  availableBalance: number;
  bookBalance: number;
  restrictedCash?: number;
  asOfDate: string;
  createdBy: string;
}): TreasuryCashPosition {
  return {
    id: input.id,
    entityId: input.entityId,
    accountId: input.accountId,
    currency: input.currency,
    availableBalance: input.availableBalance,
    bookBalance: input.bookBalance,
    restrictedCash: input.restrictedCash ?? 0,
    asOfDate: input.asOfDate,
    status: "active",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function calculateNetAvailableCash(position: TreasuryCashPosition): number {
  return Math.max(position.availableBalance - position.restrictedCash, 0);
}

export function updateTreasuryCashPositionStatus(
  position: TreasuryCashPosition,
  status: TreasuryStatus,
  updatedBy: string
): TreasuryCashPosition {
  return {
    ...position,
    status,
    audit: {
      ...position.audit,
      updatedBy,
      updatedAt: new Date().toISOString(),
    },
  };
}
