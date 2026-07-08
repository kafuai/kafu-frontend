export type PartnerReferralStatus =
  | "submitted"
  | "accepted"
  | "rejected"
  | "converted";

export interface PartnerReferral {
  id: string;
  partnerId: string;
  prospectCompanyName: string;
  status: PartnerReferralStatus;
  estimatedValue: number;
}

export function acceptPartnerReferral(
  referral: PartnerReferral,
): PartnerReferral {
  return {
    ...referral,
    status: "accepted",
  };
}
