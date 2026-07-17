import { GoToMarketKit } from "./goToMarketKitTypes";

export interface GoToMarketKitContext {
  kit: GoToMarketKit;
  launchObjectives: string[];
  risks: string[];
  notes: string[];
}
