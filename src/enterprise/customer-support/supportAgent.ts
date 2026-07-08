export interface SupportAgent {
  id: string;
  tenantId: string;
  displayName: string;
  email: string;
  active: boolean;
}

export function isSupportAgentAvailable(agent: SupportAgent): boolean {
  return agent.active;
}
