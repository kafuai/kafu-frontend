import { AIAgentProfile } from "./aiAgentTypes";
import { AIAgentTask } from "./aiAgentWorkTypes";

export type AIAgentPolicyEffect = "allow" | "deny" | "review";

export interface AIAgentPolicy {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  effect: AIAgentPolicyEffect;
  requiredAgentStatuses?: AIAgentProfile["status"][];
  blockedTaskPriorities?: AIAgentTask["priority"][];
  requiredCapabilities?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface AIAgentPolicyDecision {
  policyId: string;
  effect: AIAgentPolicyEffect;
  passed: boolean;
  reasons: string[];
}