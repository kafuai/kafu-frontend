import { GovernanceEvaluationResult } from "./governanceEvaluation";
import { GovernancePolicy } from "./governancePolicy";
import { GovernancePolicyRegistry } from "./governancePolicyRegistry";
import { GovernancePolicyValidator } from "./governancePolicyValidator";
import { GovernanceSubject } from "./governanceTypes";
import { evaluateGovernancePolicies } from "./governanceEvaluator";

export class GovernanceEngine {
  private readonly registry = new GovernancePolicyRegistry();
  private readonly validator = new GovernancePolicyValidator();

  registerPolicy(policy: GovernancePolicy): void {
    const validation = this.validator.validate(policy);

    if (!validation.valid) {
      throw new Error(validation.errors.join(" "));
    }

    this.registry.register(policy);
  }

  unregisterPolicy(policyId: string): boolean {
    return this.registry.unregister(policyId);
  }

  evaluate(subject: GovernanceSubject): GovernanceEvaluationResult {
    return evaluateGovernancePolicies(subject, this.registry.list());
  }

  listPolicies(): GovernancePolicy[] {
    return this.registry.list();
  }
}