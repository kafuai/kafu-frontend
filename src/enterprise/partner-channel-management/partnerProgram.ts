import type { PartnerType } from "./partnerChannelTypes";

export interface PartnerProgram {
  id: string;
  name: string;
  partnerTypes: PartnerType[];
  benefits: string[];
  requirements: string[];
}

export function isPartnerTypeEligible(
  program: PartnerProgram,
  type: PartnerType,
): boolean {
  return program.partnerTypes.includes(type);
}
