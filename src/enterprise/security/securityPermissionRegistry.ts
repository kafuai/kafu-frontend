import { SecurityPermission } from "./securityTypes";

export class SecurityPermissionRegistry {
  private readonly permissions = new Map<string, SecurityPermission>();

  register(permission: SecurityPermission): void {
    this.permissions.set(permission.id, permission);
  }

  get(id: string): SecurityPermission | undefined {
    return this.permissions.get(id);
  }

  list(): SecurityPermission[] {
    return [...this.permissions.values()];
  }

  has(id: string): boolean {
    return this.permissions.has(id);
  }

  remove(id: string): boolean {
    return this.permissions.delete(id);
  }

  clear(): void {
    this.permissions.clear();
  }
}