import { IdealCustomerProfile } from "./goToMarketICP";

export interface TargetAccount {
  id: string;
  companyName: string;
  profileId: string;
  score: number;
  owner: string;
}

export function createTargetAccount(
  companyName: string,
  profile: IdealCustomerProfile,
  score: number,
  owner: string,
): TargetAccount {
  return {
    id: `account-${Date.now()}`,
    companyName,
    profileId: profile.id,
    score,
    owner,
  };
}