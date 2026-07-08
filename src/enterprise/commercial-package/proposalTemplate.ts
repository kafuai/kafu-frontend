import { CommercialPackageModel } from "./commercialPackageTypes";

export class ProposalTemplate {
  constructor(private readonly commercial: CommercialPackageModel) {}

  getProposalName(): string {
    return `Proposal-${this.commercial.id}`;
  }
}
