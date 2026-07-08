import { CommercialPackageModel } from "./commercialPackageTypes";

export class ContractPackage {
  constructor(private readonly commercial: CommercialPackageModel) {}

  getContractReference(): string {
    return `CONTRACT-${this.commercial.id}`;
  }
}
