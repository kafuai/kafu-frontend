import { PlatformServices } from "./platformServices";

export class PlatformIntegration {
  constructor(
    private readonly services: PlatformServices,
  ) {}

  initialize(): PlatformServices {
    this.services.initialize();
    return this.services;
  }
}