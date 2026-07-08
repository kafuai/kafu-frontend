import type { TreasuryBankAccount, TreasuryCurrency, TreasuryStatus } from "./treasuryManagementTypes";

export function createTreasuryBankAccount(input: {
  id: string;
  entityId: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban?: string;
  currency: TreasuryCurrency;
  country: string;
  isPrimary?: boolean;
  createdBy: string;
}): TreasuryBankAccount {
  return {
    id: input.id,
    entityId: input.entityId,
    bankName: input.bankName,
    accountName: input.accountName,
    accountNumberMasked: maskAccountIdentifier(input.accountNumber),
    ibanMasked: input.iban ? maskAccountIdentifier(input.iban) : undefined,
    currency: input.currency,
    country: input.country,
    isPrimary: input.isPrimary ?? false,
    status: "active",
    audit: {
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
    },
  };
}

export function maskAccountIdentifier(value: string): string {
  if (value.length <= 4) return "****";
  return `${"*".repeat(Math.max(value.length - 4, 4))}${value.slice(-4)}`;
}

export function setTreasuryBankAccountStatus(
  account: TreasuryBankAccount,
  status: TreasuryStatus,
  updatedBy: string
): TreasuryBankAccount {
  return {
    ...account,
    status,
    audit: {
      ...account.audit,
      updatedBy,
      updatedAt: new Date().toISOString(),
    },
  };
}
