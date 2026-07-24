import type {
  DemoExperienceRepository,
} from "./demoExperienceRepository";
import {
  enterpriseDemoExperience,
} from "./enterpriseDemoExperienceCatalog";

export interface DemoExperienceBootstrapResult {
  readonly created: number;
  readonly skipped: number;
}

export class DemoExperienceBootstrapService {
  constructor(
    private readonly repository:
      DemoExperienceRepository,
  ) {}

  async bootstrap():
    Promise<DemoExperienceBootstrapResult> {
    const existing =
      await this.repository.getExperienceByKey(
        enterpriseDemoExperience.key,
      );

    if (existing) {
      return {
        created: 0,
        skipped: 1,
      };
    }

    await this.repository.saveExperience(
      {
        ...enterpriseDemoExperience,
        createdAt:
          new Date().toISOString(),
        updatedAt:
          new Date().toISOString(),
      },
    );

    return {
      created: 1,
      skipped: 0,
    };
  }
}
