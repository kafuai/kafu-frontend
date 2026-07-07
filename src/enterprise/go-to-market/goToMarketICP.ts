import { GoToMarketPriority, GoToMarketSegment } from "./goToMarketTypes";

export interface IdealCustomerProfile {
  id: string;
  name: string;
  segment: GoToMarketSegment;
  companySize: string;
  industry: string;
  priority: GoToMarketPriority;
  painPoints: string[];
  goals: string[];
}

export function createIdealCustomerProfile(
  profile: IdealCustomerProfile,
): IdealCustomerProfile {
  return profile;
}