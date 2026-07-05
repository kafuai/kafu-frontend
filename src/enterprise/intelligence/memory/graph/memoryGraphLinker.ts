import { MemoryGraphEngine } from "./memoryGraphEngine";
import { MemoryGraphNode } from "./graphNode.types";

export class MemoryGraphLinker {
  constructor(private engine: MemoryGraphEngine) {}

  linkSimilarNodes(nodes: MemoryGraphNode[]): void {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const similarity =
          nodes[i].type === nodes[j].type ? 0.8 : 0.3;

        if (similarity > 0.5) {
          this.engine.addEdge({
            id: `${nodes[i].id}-${nodes[j].id}`,
            from: nodes[i].id,
            to: nodes[j].id,
            relation: "relates_to",
            strength: similarity,
            createdAt: Date.now(),
          });
        }
      }
    }
  }
}