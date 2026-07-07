export interface GoToMarketMessagingFramework {
  id: string;
  headline: string;
  supportingMessages: string[];
  callToAction: string;
}

export function createMessagingFramework(
  framework: GoToMarketMessagingFramework,
): GoToMarketMessagingFramework {
  return framework;
}