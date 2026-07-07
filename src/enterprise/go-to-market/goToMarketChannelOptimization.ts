import { GoToMarketChannel } from "./goToMarketTypes";

export interface GoToMarketChannelPerformance {
  channel: GoToMarketChannel;
  score: number;
}

export function rankChannels(
  channels: GoToMarketChannelPerformance[],
): GoToMarketChannelPerformance[] {
  return [...channels].sort((a, b) => b.score - a.score);
}