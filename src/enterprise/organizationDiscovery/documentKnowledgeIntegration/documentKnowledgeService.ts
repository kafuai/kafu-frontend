import { DocumentKnowledgeAnalyzer } from "./documentKnowledgeAnalyzer";
import { DocumentKnowledgeReadiness } from "./documentKnowledgeReadiness";
import { DocumentKnowledgeRegistry } from "./documentKnowledgeRegistry";
import {
  KnowledgeExtractionJob,
  OrganizationDocument,
} from "./documentKnowledgeTypes";

export class DocumentKnowledgeService {
  constructor(
    private readonly registry: DocumentKnowledgeRegistry,
    private readonly analyzer: DocumentKnowledgeAnalyzer,
    private readonly readiness: DocumentKnowledgeReadiness
  ) {}

  addDocument(document: OrganizationDocument): void {
    this.registry.registerDocument(document);
  }

  addExtractionJob(job: KnowledgeExtractionJob): void {
    this.registry.registerExtractionJob(job);
  }

  getSummary() {
    return this.analyzer.summarize(
      this.registry.listDocuments(),
      this.registry.listExtractionJobs()
    );
  }

  getReadiness() {
    return this.readiness.evaluate(
      this.registry.listDocuments(),
      this.registry.listExtractionJobs()
    );
  }
}