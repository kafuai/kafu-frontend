export interface AIOrchestrationDecisionNode {
  readonly id: string;
  readonly stepId: string;
  readonly next: string[];
  readonly fallback?: string;
}

export interface AIOrchestrationDecisionGraph {
  readonly nodes: AIOrchestrationDecisionNode[];
}

export function createDecisionGraph(
  nodes: AIOrchestrationDecisionNode[],
): AIOrchestrationDecisionGraph {
  return {
    nodes,
  };
}

export function findDecisionNode(
  graph: AIOrchestrationDecisionGraph,
  id: string,
): AIOrchestrationDecisionNode | undefined {
  return graph.nodes.find((node) => node.id === id);
}
