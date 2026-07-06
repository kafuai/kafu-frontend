import {
  KnowledgeGraphNode,
  createKnowledgeGraphNode,
} from "./knowledgeGraphNode";

export class KnowledgeGraphNodeRegistry {
  private readonly nodes = new Map<string, KnowledgeGraphNode>();

  register(node: KnowledgeGraphNode): void {
    this.nodes.set(node.id, createKnowledgeGraphNode(node));
  }

  get(id: string): KnowledgeGraphNode | undefined {
    return this.nodes.get(id);
  }

  has(id: string): boolean {
    return this.nodes.has(id);
  }

  getAll(): readonly KnowledgeGraphNode[] {
    return [...this.nodes.values()];
  }

  remove(id: string): boolean {
    return this.nodes.delete(id);
  }

  clear(): void {
    this.nodes.clear();
  }

  count(): number {
    return this.nodes.size;
  }
}