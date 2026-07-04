export interface ArchitectureCapability {
  id: string;
  name: string;
  description: string;
  domainId: string;
  businessValue: number;
  technicalValue: number;
  maturityScore: number;
}

export function calculateCapabilityScore(
  capability: ArchitectureCapability,
): number {
  return (
    capability.businessValue +
    capability.technicalValue +
    capability.maturityScore
  ) / 3;
}

export function sortCapabilities(
  capabilities: ArchitectureCapability[],
): ArchitectureCapability[] {
  return [...capabilities].sort(
    (a, b) => calculateCapabilityScore(b) - calculateCapabilityScore(a),
  );
}