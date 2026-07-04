import { PlatformHealth } from "./platformHealth";

export class PlatformReadiness {
  constructor(private readonly health: PlatformHealth) {}

  ready(): boolean {
    return this.health.healthy();
  }

  report() {
    return {
      ready: this.ready(),
      checkedAt: new Date(),
      services: this.health.check(),
    };
  }
}