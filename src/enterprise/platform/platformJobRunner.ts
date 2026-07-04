import {
  PlatformBackgroundJob,
  PlatformBackgroundJobs,
} from "./platformBackgroundJobs";

export type PlatformJobHandler = (
  job: PlatformBackgroundJob,
) => Promise<void> | void;

export class PlatformJobRunner {
  constructor(private readonly jobs: PlatformBackgroundJobs) {}

  async run(
    job: PlatformBackgroundJob,
    handler: PlatformJobHandler,
  ): Promise<void> {
    this.jobs.updateStatus(job.id, "running");

    try {
      await handler(job);
      this.jobs.updateStatus(job.id, "completed");
    } catch {
      this.jobs.updateStatus(job.id, "failed");
    }
  }
}