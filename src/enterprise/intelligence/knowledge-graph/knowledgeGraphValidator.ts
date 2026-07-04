import { CorporateKnowledgeGraph } from "./knowledgeGraphTypes";

export type KnowledgeGraphValidationResult = {
  isValid: boolean;
  errors: string[];
  warnings: string[];
};

export class KnowledgeGraphValidator {
  validate(graph: CorporateKnowledgeGraph): KnowledgeGraphValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    const nodeIds = new Set(graph.nodes.map((node) => node.id));

    graph.nodes.forEach((node) => {
      if (!node.id.trim()) errors.push("Knowledge node is missing an id.");
      if (!node.title.trim()) errors.push(`Knowledge node ${node.id} is missing a title.`);
      if (!node.type) errors.push(`Knowledge node ${node.id} is missing a type.`);
    });

    graph.relations.forEach((relation) => {
      if (!relation.id.trim()) errors.push("Knowledge relation is missing an id.");

      if (!nodeIds.has(relation.sourceNodeId)) {
        errors.push(`Knowledge relation ${relation.id} has an unknown source node.`);
      }

      if (!nodeIds.has(relation.targetNodeId)) {
        errors.push(`Knowledge relation ${relation.id} has an unknown target node.`);
      }

      if (relation.sourceNodeId === relation.targetNodeId) {
        warnings.push(`Knowledge relation ${relation.id} points to the same node.`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}