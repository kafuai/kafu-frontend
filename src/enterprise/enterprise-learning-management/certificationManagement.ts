export interface Certification {
  employeeId: string;
  name: string;
  issuer: string;
  validUntil: string;
}

export function isCertificationValid(
  certification: Certification
): boolean {
  return (
    new Date(certification.validUntil).getTime() >
    Date.now()
  );
}
