import {
  EnterpriseRuleEvaluationContext,
  EnterpriseRuleEvaluationResult,
} from "./rule-types";

export interface EnterpriseRuleAuditRecord {
  id: string;
  ruleId: string;
  outcome: EnterpriseRuleEvaluationResult["outcome"];
  matched: boolean;
  reason: string;
  evaluatedAt: Date;
  context: EnterpriseRuleEvaluationContext;
}

export class EnterpriseRuleAudit {
  private readonly records: EnterpriseRuleAuditRecord[] = [];

  record(
    context: EnterpriseRuleEvaluationContext,
    result: EnterpriseRuleEvaluationResult,
  ): EnterpriseRuleAuditRecord {
    const record: EnterpriseRuleAuditRecord = {
      id: crypto.randomUUID(),
      ruleId: result.ruleId,
      outcome: result.outcome,
      matched: result.matched,
      reason: result.reason,
      evaluatedAt: result.evaluatedAt,
      context,
    };

    this.records.push(record);

    return record;
  }

  list(): EnterpriseRuleAuditRecord[] {
    return [...this.records];
  }

  listByRule(ruleId: string): EnterpriseRuleAuditRecord[] {
    return this.records.filter((record) => record.ruleId === ruleId);
  }

  clear(): void {
    this.records.length = 0;
  }
}