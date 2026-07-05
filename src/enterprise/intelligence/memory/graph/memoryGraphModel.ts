import { MemoryGraphNode } from "./graphNode.types";

export interface MemoryGraph {
  organizationId: string;
  nodes: MemoryGraphNode[];
  edges: MemoryGraphEdge[];
}

export interface MemoryGraphEdge {
  id: string;

  from: string;
  to: string;

  relation: "causes" | "supports" | "relates_to" | "conflicts_with";

  strength: number;
  createdAt: number;
}