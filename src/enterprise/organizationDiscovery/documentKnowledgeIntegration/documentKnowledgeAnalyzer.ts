import {
  KnowledgeExtractionJob,
  OrganizationDocument,
} from "./documentKnowledgeTypes";

export interface DocumentKnowledgeSummary {
  readonly totalDocuments: number;
  readonly activeDocuments: number;
  readonly indexedDocuments: number;
  readonly pendingExtractionJobs: number;
  readonly completedExtractionJobs: number;
}

export class DocumentKnowledgeAnalyzer {
  summarize(
    documents: readonly OrganizationDocument[],
    jobs: readonly KnowledgeExtractionJob[]
  ): DocumentKnowledgeSummary {
    return {
      totalDocuments: documents.length,
      activeDocuments: documents.filter((document) => document.status === "active").length,
      indexedDocuments: documents.filter((document) => document.status === "indexed").length,
      pendingExtractionJobs: jobs.filter((job) => job.status === "pending").length,
      completedExtractionJobs: jobs.filter((job) => job.status === "completed").length,
    };
  }
}