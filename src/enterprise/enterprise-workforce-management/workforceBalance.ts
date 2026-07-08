export interface WorkforceBalance {
  demand: number;
  supply: number;
}

export function calculateWorkforceBalance(
  balance: WorkforceBalance
): number {
  return balance.supply - balance.demand;
}

export function isBalanced(
  balance: WorkforceBalance
): boolean {
  return (
    calculateWorkforceBalance(balance) >= 0
  );
}
