import { ResiliencePolicyRegistry } from "./resilienceRegistry";
import {
  ResilienceExecutionResult,
  ResiliencePolicy,
} from "./resilienceTypes";
import {
  executeResilientOperation,
  ResilienceEngineOptions,
} from "./resilienceEngine";

export class ResilienceRuntime {
  private readonly registry = new ResiliencePolicyRegistry();

  registerPolicy(policy: ResiliencePolicy): void {
    this.registry.register(policy);
  }

  getPolicy(policyId: string): ResiliencePolicy | undefined {
    return this.registry.get(policyId);
  }

  listPolicies(): ResiliencePolicy[] {
    return this.registry.list();
  }

  async execute<T>(
    options: ResilienceEngineOptions<T>,
  ): Promise<ResilienceExecutionResult<T>> {
    return await executeResilientOperation(options);
  }
}