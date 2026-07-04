export type DiscoveredService = {
  name: string;
  version?: string;
  description?: string;
};

export class ServiceDiscovery {
  discover(): DiscoveredService[] {
    // لاحقًا سنربطها بالـ plugin system
    return [];
  }
}