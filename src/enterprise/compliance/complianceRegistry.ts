import { ComplianceFramework } from "./complianceFramework";

export class ComplianceRegistry {
  private readonly frameworks = new Map<string, ComplianceFramework>();

  register(framework: ComplianceFramework): void {
    this.frameworks.set(framework.id, framework);
  }

  unregister(id: string): boolean {
    return this.frameworks.delete(id);
  }

  get(id: string): ComplianceFramework | undefined {
    return this.frameworks.get(id);
  }

  getAll(): ComplianceFramework[] {
    return [...this.frameworks.values()];
  }

  has(id: string): boolean {
    return this.frameworks.has(id);
  }

  clear(): void {
    this.frameworks.clear();
  }

  size(): number {
    return this.frameworks.size;
  }
}