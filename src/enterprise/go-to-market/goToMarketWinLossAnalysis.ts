export type GoToMarketDealOutcome = "won" | "lost";

export interface GoToMarketWinLossRecord {
  id: string;
  outcome: GoToMarketDealOutcome;
  reason: string;
  value: number;
}

export interface GoToMarketWinLossSummary {
  totalDeals: number;
  wins: number;
  losses: number;
  winRate: number;
}

export function summarizeWinLossAnalysis(
  records: GoToMarketWinLossRecord[],
): GoToMarketWinLossSummary {
  const wins = records.filter((r) => r.outcome === "won").length;
  const losses = records.length - wins;

  return {
    totalDeals: records.length,
    wins,
    losses,
    winRate: records.length === 0 ? 0 : Math.round((wins / records.length) * 100),
  };
}