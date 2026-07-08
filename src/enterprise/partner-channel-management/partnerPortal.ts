export interface PartnerPortalAccess {
  partnerId: string;
  enabled: boolean;
  allowedSections: string[];
  lastLoginAt?: Date;
}

export function enablePartnerPortal(
  access: PartnerPortalAccess,
): PartnerPortalAccess {
  return {
    ...access,
    enabled: true,
  };
}
