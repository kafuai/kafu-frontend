import { GovernanceDecision } from "./governanceTypes";

export type GovernanceEvent = {
  id: string;
  type: "governance.decision.created";
  decision: GovernanceDecision;
  createdAt: Date;
};

export function createGovernanceDecisionEvent(
  decision: GovernanceDecision,
): GovernanceEvent {
  return {
    id: `${decision.subject.type}:${decision.subject.id}:${Date.now()}`,
    type: "governance.decision.created",
    decision,
    createdAt: new Date(),
  };
}