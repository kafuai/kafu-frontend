import { KnowledgeReasoningConclusion } from "./knowledgeReasoningConclusion";
import { KnowledgeReasoningFact } from "./knowledgeReasoningFact";
import { KnowledgeReasoningRule } from "./knowledgeReasoningRule";

export function executeKnowledgeReasoning(
  facts: readonly KnowledgeReasoningFact[],
  rules: readonly KnowledgeReasoningRule[],
): readonly KnowledgeReasoningConclusion[] {
  const factKeys = new Set(
    facts.map((fact) => `${fact.subject}.${fact.predicate}`),
  );

  return rules
    .filter((rule) =>
      rule.conditions.every((condition) =>
        factKeys.has(`${condition.field}.${condition.operator}`),
      ),
    )
    .map((rule) => ({
      id: `conclusion-${rule.id}`,
      ruleId: rule.id,
      title: rule.name,
      explanation: rule.conclusion,
      confidence: rule.confidence,
      severity: rule.severity,
      evidenceFactIds: facts.map((fact) => fact.id),
      createdAt: new Date().toISOString(),
    }));
}