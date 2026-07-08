export type PartnerDealRegistrationStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "expired"
  | "won"
  | "lost";

export interface PartnerDealRegistration {
  id: string;
  partnerId: string;
  accountName: string;
  status: PartnerDealRegistrationStatus;
  expectedValue: number;
  expiresAt?: Date;
}

export function approveDealRegistration(
  deal: PartnerDealRegistration,
): PartnerDealRegistration {
  return {
    ...deal,
    status: "approved",
  };
}
