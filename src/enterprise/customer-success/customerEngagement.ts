export interface CustomerEngagement {
  accountId: string;
  meetings: number;
  emails: number;
  supportInteractions: number;
  engagementScore: number;
}

export function calculateEngagementScore(
  engagement: CustomerEngagement,
): number {
  return engagement.engagementScore;
}