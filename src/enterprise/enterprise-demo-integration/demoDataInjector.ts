export interface EnterpriseDemoDataset {
  id: string;
  organizationId: string;
  scenarioId?: string | null;
  name: string;
  version: string;
  data: Record<string, unknown>;
  createdAt: string;
}

export interface EnterpriseDemoDataInjectionResult {
  datasetId: string;
  target: string;
  injectedKeys: string[];
  injectedAt: string;
  success: boolean;
  message: string;
}

export interface DemoDataInjectionTarget {
  target: string;
  apply(
    data: Record<string, unknown>,
  ): void | Promise<void>;
}

export class DemoDataInjector {
  private readonly datasets =
    new Map<string, EnterpriseDemoDataset>();

  registerDataset(
    dataset: EnterpriseDemoDataset,
  ): EnterpriseDemoDataset {
    this.validateDataset(dataset);

    const storedDataset =
      this.cloneDataset(dataset);

    this.datasets.set(
      storedDataset.id,
      storedDataset,
    );

    return this.cloneDataset(storedDataset);
  }

  getDataset(
    datasetId: string,
  ): EnterpriseDemoDataset | null {
    const dataset =
      this.datasets.get(datasetId);

    return dataset
      ? this.cloneDataset(dataset)
      : null;
  }

  listDatasets(
    organizationId?: string,
    scenarioId?: string,
  ): EnterpriseDemoDataset[] {
    return Array.from(this.datasets.values())
      .filter((dataset) => {
        if (
          organizationId &&
          dataset.organizationId !== organizationId
        ) {
          return false;
        }

        if (
          scenarioId &&
          dataset.scenarioId !== scenarioId
        ) {
          return false;
        }

        return true;
      })
      .sort((left, right) =>
        left.name.localeCompare(right.name),
      )
      .map((dataset) =>
        this.cloneDataset(dataset),
      );
  }

  async inject(
    datasetId: string,
    target: DemoDataInjectionTarget,
  ): Promise<EnterpriseDemoDataInjectionResult> {
    const dataset =
      this.datasets.get(datasetId);

    if (!dataset) {
      throw new Error(
        `Demo dataset ${datasetId} was not found.`,
      );
    }

    if (!target.target.trim()) {
      throw new Error(
        "Demo data injection target is required.",
      );
    }

    try {
      await target.apply({
        ...dataset.data,
      });

      const injectedKeys =
        Object.keys(dataset.data);

      return {
        datasetId,
        target: target.target,
        injectedKeys,
        injectedAt: new Date().toISOString(),
        success: true,
        message:
          `${injectedKeys.length} demo data key(s) injected successfully.`,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown demo data injection error.";

      return {
        datasetId,
        target: target.target,
        injectedKeys: [],
        injectedAt: new Date().toISOString(),
        success: false,
        message:
          `Demo data injection failed: ${message}`,
      };
    }
  }

  removeDataset(datasetId: string): boolean {
    return this.datasets.delete(datasetId);
  }

  clear(): void {
    this.datasets.clear();
  }

  count(): number {
    return this.datasets.size;
  }

  private validateDataset(
    dataset: EnterpriseDemoDataset,
  ): void {
    if (!dataset.id.trim()) {
      throw new Error(
        "Demo dataset id is required.",
      );
    }

    if (!dataset.organizationId.trim()) {
      throw new Error(
        "Demo dataset organizationId is required.",
      );
    }

    if (!dataset.name.trim()) {
      throw new Error(
        "Demo dataset name is required.",
      );
    }

    if (!dataset.version.trim()) {
      throw new Error(
        "Demo dataset version is required.",
      );
    }
  }

  private cloneDataset(
    dataset: EnterpriseDemoDataset,
  ): EnterpriseDemoDataset {
    return {
      ...dataset,
      data: {
        ...dataset.data,
      },
    };
  }
}
