import type { PartnerPerformance } from "./partnerPerformance";
import { calculatePartnerWinRate } from "./partnerPerformance";

export interface PartnerChannelEngineResult {
  partnerId: string;
  winRate: number;
  evaluatedAt: Date;
}

export function evaluatePartnerChannel(
  performance: PartnerPerformance,
): PartnerChannelEngineResult {
  return {
    partnerId: performance.partnerId,
    winRate: calculatePartnerWinRate(performance),
    evaluatedAt: new Date(),
  };
}
