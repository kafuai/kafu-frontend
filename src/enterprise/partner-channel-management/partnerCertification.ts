export interface PartnerCertification {
  id: string;
  partnerId: string;
  name: string;
  issuedAt: Date;
  expiresAt?: Date;
}

export function isCertificationExpired(
  certification: PartnerCertification,
  now: Date = new Date(),
): boolean {
  return Boolean(certification.expiresAt && certification.expiresAt < now);
}
