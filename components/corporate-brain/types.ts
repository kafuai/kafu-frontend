export interface Company {
  id: string;
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
}

export interface DiscoveryAnswer {
  id: string;
  question: string;
  answer: string;
  question_order: number;
}

export interface AIResponse {
  data?: {
    text?: string;
    provider?: string;
    model?: string;
    evidenceCount?: number;
    citations?: Array<{
      evidenceId: string;
      source: string;
      label: string;
    }>;
  };
  error?: string;
  code?: string;
}

export type KnowledgeSourceStatus = "ready" | "processing" | "missing";

export interface GraphCounts {
  policies: number;
  objectives: number;
  risks: number;
  teams: number;
  connections: number;
}