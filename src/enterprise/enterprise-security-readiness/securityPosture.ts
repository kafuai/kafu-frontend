import { EnterpriseSecurityModel } from "./enterpriseSecurityTypes";

export class SecurityPosture {
  constructor(private readonly security: EnterpriseSecurityModel) {}

  getScore(): number {
    return this.security.score;
  }
}
