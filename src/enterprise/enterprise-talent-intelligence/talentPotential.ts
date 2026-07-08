export interface TalentPotential {
  employeeId: string;
  potentialScore: number;
  readinessScore: number;
}

export function calculateTalentPotential(
  potential: TalentPotential
): number {
  return Math.round(
    potential.potentialScore * 0.6 +
      potential.readinessScore * 0.4
  );
}

export function isHighPotential(
  potential: TalentPotential
): boolean {
  return calculateTalentPotential(potential) >= 80;
}
