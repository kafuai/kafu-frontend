export type CrisisDecision = {
  id: string;
  crisisId: string;
  decidedAt: string;
  decidedBy: string;
  decision: string;
  rationale: string;
  expectedOutcome?: string;
  risks?: string[];
};

export class CrisisDecisionLog {
  private readonly decisions = new Map<string, CrisisDecision[]>();

  addDecision(decision: CrisisDecision): CrisisDecision {
    const existing = this.decisions.get(decision.crisisId) ?? [];
    this.decisions.set(decision.crisisId, [...existing, decision]);
    return decision;
  }

  listByCrisis(crisisId: string): CrisisDecision[] {
    return this.decisions.get(crisisId) ?? [];
  }
}