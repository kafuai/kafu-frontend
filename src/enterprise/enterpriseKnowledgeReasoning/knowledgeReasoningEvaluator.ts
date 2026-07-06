import { KnowledgeReasoningFact } from "./knowledgeReasoningFact";
import { KnowledgeReasoningRuleCondition } from "./knowledgeReasoningRule";

export function evaluateKnowledgeReasoningCondition(
  condition: KnowledgeReasoningRuleCondition,
  facts: readonly KnowledgeReasoningFact[],
): boolean {
  return facts.some((fact) => {
    if (condition.operator === "exists") {
      return fact.subject === condition.field;
    }

    if (condition.operator === "equals") {
      return (
        fact.subject === condition.field &&
        fact.object === condition.value
      );
    }

    if (condition.operator === "not_equals") {
      return (
        fact.subject === condition.field &&
        fact.object !== condition.value
      );
    }

    if (condition.operator === "contains") {
      return (
        fact.subject === condition.field &&
        fact.object.includes(condition.value ?? "")
      );
    }

    return false;
  });
}