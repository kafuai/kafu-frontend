import {
  KnowledgeExtractionJob,
  OrganizationDocument,
} from "./documentKnowledgeTypes";

export interface DocumentKnowledgeReadinessResult {
  readonly isReady: boolean;
  readonly score: number;
  readonly issues: readonly string[];
}

export class DocumentKnowledgeReadiness {
  evaluate(
    documents: readonly OrganizationDocument[],
    jobs: readonly KnowledgeExtractionJob[]
  ): DocumentKnowledgeReadinessResult {
    const issues: string[] = [];

    if (documents.length === 0) {
      issues.push("No organizational documents have been registered.");
    }

    const hasIndexedDocuments = documents.some(
      (document) => document.status === "indexed" || document.status === "active"
    );

    if (!hasIndexedDocuments) {
      issues.push("No indexed or active documents are available for knowledge discovery.");
    }

    const hasFailedJobs = jobs.some((job) => job.status === "failed");

    if (hasFailedJobs) {
      issues.push("One or more knowledge extraction jobs have failed.");
    }

    const score = Math.max(0, 100 - issues.length * 30);

    return {
      isReady: issues.length === 0,
      score,
      issues,
    };
  }
}