import { EnterpriseSecurityModel } from "./enterpriseSecurityTypes";

export class SecurityCompliance {
  constructor(private readonly security: EnterpriseSecurityModel) {}

  isCompliant(): boolean {
    return this.security.compliance === "compliant";
  }
}
