import { EnterpriseRiskControl } from "./riskControls";

export class EnterpriseRiskControlRegistry {
  private readonly controls = new Map<string, EnterpriseRiskControl>();

  register(control: EnterpriseRiskControl): void {
    this.controls.set(control.controlId, control);
  }

  get(controlId: string): EnterpriseRiskControl | undefined {
    return this.controls.get(controlId);
  }

  list(): EnterpriseRiskControl[] {
    return [...this.controls.values()];
  }

  listByRisk(riskId: string): EnterpriseRiskControl[] {
    return this.list().filter((control) => control.riskId === riskId);
  }

  remove(controlId: string): boolean {
    return this.controls.delete(controlId);
  }

  clear(): void {
    this.controls.clear();
  }
}