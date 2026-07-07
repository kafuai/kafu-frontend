import { GoToMarketSegment } from "./goToMarketTypes";
import { IdealCustomerProfile } from "./goToMarketICP";

export interface CustomerSegmentGroup {
  segment: GoToMarketSegment;
  profiles: IdealCustomerProfile[];
}

export function groupCustomersBySegment(
  profiles: IdealCustomerProfile[],
): CustomerSegmentGroup[] {
  const groups = new Map<GoToMarketSegment, IdealCustomerProfile[]>();

  for (const profile of profiles) {
    const existing = groups.get(profile.segment) ?? [];
    existing.push(profile);
    groups.set(profile.segment, existing);
  }

  return [...groups.entries()].map(([segment, profiles]) => ({
    segment,
    profiles,
  }));
}