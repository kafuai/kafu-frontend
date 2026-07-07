import {
  GoToMarketSegment,
  GoToMarketStage,
} from "./goToMarketTypes";

export interface GoToMarketPlaybookStep {
  title: string;
  stage: GoToMarketStage;
  owner: string;
  required: boolean;
}

export interface GoToMarketPlaybook {
  id: string;
  name: string;
  segment: GoToMarketSegment;
  steps: GoToMarketPlaybookStep[];
}

export function createGoToMarketPlaybook(
  playbook: GoToMarketPlaybook,
): GoToMarketPlaybook {
  return playbook;
}