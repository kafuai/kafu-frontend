import { AIDecisionOption } from "./aiDecisionOption";

export interface AIDecisionContext {
  id: string;
  organizationId: string;
  objective: string;
  description?: string;
  options: AIDecisionOption[];
  constraints?: string[];
  assumptions?: string[];
  createdAt: string;
  createdBy: string;
}