import { EnterpriseSecurityModel } from "./enterpriseSecurityTypes";
import { SecurityPosture } from "./securityPosture";
import { SecurityPolicy } from "./securityPolicy";
import { IdentityGovernance } from "./identityGovernance";
import { AccessReview } from "./accessReview";
import { SecurityCompliance } from "./securityCompliance";
import { SecurityMonitoring } from "./securityMonitoring";
import { ThreatAssessment } from "./threatAssessment";
import { SecurityAudit } from "./securityAudit";
import { SecurityReporting } from "./securityReporting";

export class EnterpriseSecurityFactory {
  static create(security: EnterpriseSecurityModel) {
    return {
      posture: new SecurityPosture(security),
      policy: new SecurityPolicy(security.policies),
      identity: new IdentityGovernance(security.policies),
      accessReview: new AccessReview(security.findings),
      compliance: new SecurityCompliance(security),
      monitoring: new SecurityMonitoring(security.findings),
      threat: new ThreatAssessment(security.findings),
      audit: new SecurityAudit(security),
      reporting: new SecurityReporting(security),
    };
  }
}
