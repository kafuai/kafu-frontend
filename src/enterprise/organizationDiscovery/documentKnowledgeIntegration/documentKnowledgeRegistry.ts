import {
  KnowledgeExtractionJob,
  OrganizationDocument,
} from "./documentKnowledgeTypes";

export class DocumentKnowledgeRegistry {
  private readonly documents = new Map<string, OrganizationDocument>();
  private readonly jobs = new Map<string, KnowledgeExtractionJob>();

  registerDocument(document: OrganizationDocument): void {
    this.documents.set(document.id, document);
  }

  registerExtractionJob(job: KnowledgeExtractionJob): void {
    this.jobs.set(job.id, job);
  }

  getDocument(id: string): OrganizationDocument | undefined {
    return this.documents.get(id);
  }

  getExtractionJob(id: string): KnowledgeExtractionJob | undefined {
    return this.jobs.get(id);
  }

  listDocuments(): readonly OrganizationDocument[] {
    return [...this.documents.values()];
  }

  listExtractionJobs(): readonly KnowledgeExtractionJob[] {
    return [...this.jobs.values()];
  }

  clear(): void {
    this.documents.clear();
    this.jobs.clear();
  }
}