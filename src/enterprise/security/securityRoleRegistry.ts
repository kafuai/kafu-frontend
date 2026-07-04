import { SecurityRole } from "./securityTypes";

export class SecurityRoleRegistry {
  private readonly roles = new Map<string, SecurityRole>();

  register(role: SecurityRole): void {
    this.roles.set(role.id, role);
  }

  get(id: string): SecurityRole | undefined {
    return this.roles.get(id);
  }

  list(): SecurityRole[] {
    return [...this.roles.values()];
  }

  has(id: string): boolean {
    return this.roles.has(id);
  }

  remove(id: string): boolean {
    return this.roles.delete(id);
  }

  clear(): void {
    this.roles.clear();
  }
}