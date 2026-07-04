import {
  PlatformBackgroundJob,
  PlatformBackgroundJobs,
} from "./platformBackgroundJobs";
import { PlatformJobHandler, PlatformJobRunner } from "./platformJobRunner";

export class PlatformBackgroundWorker {
  constructor(
    private readonly jobs: PlatformBackgroundJobs,
    private readonly runner: PlatformJobRunner,
  ) {}

  async process(
    handler: PlatformJobHandler,
  ): Promise<PlatformBackgroundJob[]> {
    const queued = this.jobs
      .list()
      .filter((job) => job.status === "queued");

    for (const job of queued) {
      await this.runner.run(job, handler);
    }

    return queued;
  }
}