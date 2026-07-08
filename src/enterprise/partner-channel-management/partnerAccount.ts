import type { PartnerChannelSummary, PartnerStatus, PartnerType } from "./partnerChannelTypes";

export interface PartnerAccount {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  region?: string;
  ownerId: string;
  summary: PartnerChannelSummary;
}

export function createPartnerAccount(account: PartnerAccount): PartnerAccount {
  return account;
}
