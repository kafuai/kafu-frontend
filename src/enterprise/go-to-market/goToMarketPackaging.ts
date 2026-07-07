export interface GoToMarketPackage {
  id: string;
  name: string;
  includedFeatures: string[];
  limits: string[];
  recommendedFor: string;
}

export function createGoToMarketPackage(
  packageConfig: GoToMarketPackage,
): GoToMarketPackage {
  return packageConfig;
}