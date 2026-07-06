import {
  KnowledgeReasoningConclusion,
  createKnowledgeReasoningConclusion,
} from "./knowledgeReasoningConclusion";
import { KnowledgeReasoningFact } from "./knowledgeReasoningFact";
import { KnowledgeReasoningRule } from "./knowledgeReasoningRule";
import { evaluateKnowledgeReasoningCondition } from "./knowledgeReasoningEvaluator";

export function inferKnowledgeConclusions(
  facts: readonly KnowledgeReasoningFact[],
  rules: readonly KnowledgeReasoningRule[],
): readonly KnowledgeReasoningConclusion[] {
  return rules
    .filter((rule) =>
      rule.conditions.every((condition) =>
        evaluateKnowledgeReasoningCondition(condition, facts),
      ),
    )
    .map((rule) =>
      createKnowledgeReasoningConclusion({
        id: `inference-${rule.id}`,
        ruleId: rule.id,
        title: rule.name,
        explanation: rule.conclusion,
        confidence: rule.confidence,
        severity: rule.severity,
        evidenceFactIds: facts.map((fact) => fact.id),
        createdAt: new Date().toISOString(),
      }),
    );
}