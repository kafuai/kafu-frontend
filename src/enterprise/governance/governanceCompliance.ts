import { GovernanceSeverity, GovernanceSubject } from "./governanceTypes";

export type ComplianceSignalStatus = "compliant" | "warning" | "violation";

export type ComplianceSignal = {
  id: string;
  subject: GovernanceSubject;
  status: ComplianceSignalStatus;
  severity: GovernanceSeverity;
  message: string;
  createdAt: Date;
};

export function createComplianceSignal(
  subject: GovernanceSubject,
  status: ComplianceSignalStatus,
  severity: GovernanceSeverity,
  message: string,
): ComplianceSignal {
  return {
    id: `${subject.type}:${subject.id}:${Date.now()}`,
    subject,
    status,
    severity,
    message,
    createdAt: new Date(),
  };
}