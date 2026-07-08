import { CommercialPackageModel } from "./commercialPackageTypes";

export class OnboardingPackage {
  constructor(private readonly commercial: CommercialPackageModel) {}

  getWelcomeMessage(): string {
    return `Welcome to ${this.commercial.id}`;
  }
}
