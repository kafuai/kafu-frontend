import { CommercialPackageModel } from "./commercialPackageTypes";

export class CommercialOffering {
  constructor(private readonly commercial: CommercialPackageModel) {}

  getOffering(): CommercialPackageModel {
    return this.commercial;
  }
}
