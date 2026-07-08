export interface CustomerAdoption {
  accountId: string;
  activeUsers: number;
  enabledModules: number;
  adoptionScore: number;
}

export function calculateAdoptionScore(
  adoption: CustomerAdoption,
): number {
  return adoption.adoptionScore;
}