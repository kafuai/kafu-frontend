import { GoToMarketChannel } from "./goToMarketTypes";

export interface GoToMarketChannelStrategy {
  id: string;
  channel: GoToMarketChannel;
  objective: string;
  expectedContribution: number;
  owner: string;
}

export function createChannelStrategy(
  strategy: GoToMarketChannelStrategy,
): GoToMarketChannelStrategy {
  return strategy;
}