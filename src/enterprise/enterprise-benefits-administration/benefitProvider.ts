export interface BenefitProvider {
  id: string;
  name: string;
  services: string[];
  active: boolean;
}

export function activateBenefitProvider(
  provider: BenefitProvider
): BenefitProvider {
  return {
    ...provider,
    active: true,
  };
}

export function providesService(
  provider: BenefitProvider,
  service: string
): boolean {
  return provider.services.includes(service);
}
