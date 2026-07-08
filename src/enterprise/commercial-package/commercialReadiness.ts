import { CommercialPackageModel } from "./commercialPackageTypes";

export class CommercialReadiness {
  constructor(private readonly commercial: CommercialPackageModel) {}

  isReady(): boolean {
    return (
      this.commercial.status === "published" &&
      this.commercial.plans.length > 0
    );
  }
}
