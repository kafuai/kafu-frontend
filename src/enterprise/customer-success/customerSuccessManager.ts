export interface CustomerSuccessManager {
  id: string;
  name: string;
  accountIds: string[];
}

export function assignAccountToManager(
  manager: CustomerSuccessManager,
  accountId: string,
): CustomerSuccessManager {
  return {
    ...manager,
    accountIds: Array.from(new Set([...manager.accountIds, accountId])),
  };
}