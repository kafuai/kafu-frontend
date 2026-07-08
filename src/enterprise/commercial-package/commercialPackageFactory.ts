import { CommercialPackageModel } from "./commercialPackageTypes";
import { PricingCatalog } from "./pricingCatalog";
import { LicenseBundle } from "./licenseBundle";
import { CommercialOffering } from "./commercialOffering";
import { ProposalTemplate } from "./proposalTemplate";
import { QuoteGenerator } from "./quoteGenerator";
import { SalesCollateral } from "./salesCollateral";
import { ContractPackage } from "./contractPackage";
import { OnboardingPackage } from "./onboardingPackage";
import { CommercialReadiness } from "./commercialReadiness";

export class CommercialPackageFactory {
  static create(commercial: CommercialPackageModel) {
    return {
      pricing: new PricingCatalog(commercial.plans),
      licensing: new LicenseBundle(commercial.plans),
      offering: new CommercialOffering(commercial),
      proposal: new ProposalTemplate(commercial),
      quotes: new QuoteGenerator(commercial.plans),
      sales: new SalesCollateral(commercial),
      contracts: new ContractPackage(commercial),
      onboarding: new OnboardingPackage(commercial),
      readiness: new CommercialReadiness(commercial),
    };
  }
}
