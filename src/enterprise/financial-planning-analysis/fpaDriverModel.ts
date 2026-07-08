export interface FPADriver {
  id: string;
  name: string;
  currentValue: number;
  projectedValue: number;
  weight: number;
}

export function calculateDriverImpact(drivers: FPADriver[]): number {
  return Number(
    drivers.reduce((total, driver) => total + (driver.projectedValue - driver.currentValue) * driver.weight, 0).toFixed(2),
  );
}
