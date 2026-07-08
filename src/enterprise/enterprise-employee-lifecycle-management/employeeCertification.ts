export interface EmployeeCertification {
  employeeId: string;
  certificationName: string;
  issuer: string;
  validUntil: string;
}

export function isCertificationValid(
  certification: EmployeeCertification
): boolean {
  return (
    new Date(certification.validUntil).getTime() >
    Date.now()
  );
}
