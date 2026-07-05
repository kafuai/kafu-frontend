import { MemoryGraph, MemoryGraphEdge } from "./memoryGraphModel";
import { MemoryGraphNode } from "./graphNode.types";

export class MemoryGraphEngine {
  private graphs = new Map<string, MemoryGraph>();

  private getOrCreate(orgId: string): MemoryGraph {
    if (!this.graphs.has(orgId)) {
      this.graphs.set(orgId, {
        organizationId: orgId,
        nodes: [],
        edges: [],
      });
    }

    return this.graphs.get(orgId)!;
  }

  addNode(node: MemoryGraphNode): void {
    const graph = this.getOrCreate(node.organizationId);
    graph.nodes.push(node);
  }

  addEdge(edge: MemoryGraphEdge): void {
    const orgId = edge.from.split("-")[0] ?? "default";
    const graph = this.getOrCreate(orgId);
    graph.edges.push(edge);
  }

  getGraph(organizationId: string): MemoryGraph {
    return this.getOrCreate(organizationId);
  }

  clear(organizationId: string): void {
    this.graphs.delete(organizationId);
  }
}