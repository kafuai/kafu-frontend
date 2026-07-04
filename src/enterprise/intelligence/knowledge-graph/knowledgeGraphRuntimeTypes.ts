import { CorporateKnowledgeGraph } from "./knowledgeGraphTypes";
import { KnowledgeGraphSourceComposerInput } from "./knowledgeGraphSourceComposer";
import { KnowledgeGraphDiagnostics } from "./knowledgeGraphDiagnostics";

export type KnowledgeGraphRuntimeInput = KnowledgeGraphSourceComposerInput;

export type KnowledgeGraphRuntimeResult = {
  graph: CorporateKnowledgeGraph;
  diagnostics: KnowledgeGraphDiagnostics;
  generatedAt: string;
};

export type KnowledgeGraphRuntimeStatus =
  | "idle"
  | "building"
  | "ready"
  | "failed";