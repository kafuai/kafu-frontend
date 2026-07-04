export type PlatformPipelineStep = {
  name: string;
  execute(): void | Promise<void>;
};

export class PlatformPipeline {
  private readonly steps: PlatformPipelineStep[] = [];

  add(step: PlatformPipelineStep): void {
    this.steps.push(step);
  }

  async run(): Promise<void> {
    for (const step of this.steps) {
      await step.execute();
    }
  }

  list(): PlatformPipelineStep[] {
    return [...this.steps];
  }
}