import { EnterpriseRisk } from "./riskTypes";
import {
  EnterpriseRiskRegister,
  EnterpriseRiskRegisterEntry,
} from "./riskRegister";
import { generateEnterpriseRiskReport } from "./riskReporting";

export class EnterpriseRiskEngine {
  private readonly register = new EnterpriseRiskRegister();

  registerRisk(risk: EnterpriseRisk): EnterpriseRiskRegisterEntry {
    return this.register.registerRisk(risk);
  }

  updateRisk(risk: EnterpriseRisk): EnterpriseRiskRegisterEntry {
    return this.register.updateRisk(risk);
  }

  listRisks(): EnterpriseRiskRegisterEntry[] {
    return this.register.listRisks();
  }

  generateReport() {
    return generateEnterpriseRiskReport(this.register.listRisks());
  }
}