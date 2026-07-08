export interface SalaryBand {
  name: string;
  minimum: number;
  maximum: number;
  currency: string;
}

export function isSalaryInBand(
  band: SalaryBand,
  salary: number
): boolean {
  return (
    salary >= band.minimum &&
    salary <= band.maximum
  );
}

export function calculateBandRange(
  band: SalaryBand
): number {
  return band.maximum - band.minimum;
}
