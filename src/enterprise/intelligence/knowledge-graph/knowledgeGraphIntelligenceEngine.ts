import { KnowledgeEnrichmentEngine } from "./knowledgeEnrichmentEngine";
import { KnowledgeGraphBuilder } from "./knowledgeGraphBuilder";
import { KnowledgeMergeEngine } from "./knowledgeMergeEngine";
import { KnowledgeGraphValidator } from "./knowledgeGraphValidator";
import { KnowledgeExtractionSource } from "./knowledgeExtractionTypes";
import { CorporateKnowledgeGraph } from "./knowledgeGraphTypes";

export class KnowledgeGraphIntelligenceEngine {
  constructor(
    private readonly builder = new KnowledgeGraphBuilder(),
    private readonly mergeEngine = new KnowledgeMergeEngine(),
    private readonly enrichmentEngine = new KnowledgeEnrichmentEngine(),
    private readonly validator = new KnowledgeGraphValidator(),
  ) {}

  buildEnterpriseKnowledgeGraph(
    sources: KnowledgeExtractionSource[],
  ): CorporateKnowledgeGraph {
    if (sources.length === 0) {
      return this.createEmptyGraph();
    }

    const graph = sources.reduce<CorporateKnowledgeGraph>(
      (currentGraph, source) => {
        const sourceGraph = this.builder.buildFromSource(source);
        return this.mergeEngine.mergeGraphs(currentGraph, sourceGraph);
      },
      this.createEmptyGraph(),
    );

    return this.validateAndReturn(this.enrichmentEngine.enrich(graph));
  }

  buildFromSingleSource(
    source: KnowledgeExtractionSource,
  ): CorporateKnowledgeGraph {
    const graph = this.builder.buildFromSource(source);
    return this.validateAndReturn(this.enrichmentEngine.enrich(graph));
  }

  mergeEnterpriseGraphs(
    graphs: CorporateKnowledgeGraph[],
  ): CorporateKnowledgeGraph {
    if (graphs.length === 0) {
      return this.createEmptyGraph();
    }

    const mergedGraph = graphs.reduce<CorporateKnowledgeGraph>(
      (currentGraph, graph) => this.mergeEngine.mergeGraphs(currentGraph, graph),
      this.createEmptyGraph(),
    );

    return this.validateAndReturn(this.enrichmentEngine.enrich(mergedGraph));
  }

  summarizeGraph(graph: CorporateKnowledgeGraph): string {
    return [
      `Knowledge graph generated at ${graph.generatedAt}.`,
      `It contains ${graph.nodes.length} nodes and ${graph.relations.length} relations.`,
      `Connectivity ratio: ${this.calculateConnectivityRatio(graph)}.`,
    ].join(" ");
  }

  calculateConnectivityRatio(graph: CorporateKnowledgeGraph): number {
    if (graph.nodes.length === 0) {
      return 0;
    }

    return Number((graph.relations.length / graph.nodes.length).toFixed(2));
  }

  private createEmptyGraph(): CorporateKnowledgeGraph {
    return {
      nodes: [],
      relations: [],
      generatedAt: new Date().toISOString(),
    };
  }

  private validateAndReturn(
    graph: CorporateKnowledgeGraph,
  ): CorporateKnowledgeGraph {
    const validation = this.validator.validate(graph);

    if (!validation.isValid) {
      throw new Error(validation.errors.join(" "));
    }

    return graph;
  }
}