import {
  EnterpriseHealthCheck,
  EnterpriseHealthCheckResult,
} from "./enterpriseHealthTypes";

export class EnterpriseHealthMonitor {
  private readonly checks = new Map<string, EnterpriseHealthCheck>();

  register(check: EnterpriseHealthCheck): void {
    this.checks.set(check.name, check);
  }

  async runAll(): Promise<EnterpriseHealthCheckResult[]> {
    const results: EnterpriseHealthCheckResult[] = [];

    for (const check of this.checks.values()) {
      results.push(await check.check());
    }

    return results;
  }

  getRegisteredChecks(): string[] {
    return Array.from(this.checks.keys());
  }
}