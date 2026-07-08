import { CommercialPackageModel } from "./commercialPackageTypes";

export class SalesCollateral {
  constructor(private readonly commercial: CommercialPackageModel) {}

  getSalesAssetsCount(): number {
    return this.commercial.plans.length;
  }
}
