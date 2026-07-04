export type PlatformJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed";

export type PlatformBackgroundJob = {
  id: string;
  name: string;
  payload?: Record<string, unknown>;
  status: PlatformJobStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class PlatformBackgroundJobs {
  private readonly jobs = new Map<string, PlatformBackgroundJob>();

  enqueue(
    job: Omit<PlatformBackgroundJob, "status" | "createdAt" | "updatedAt">,
  ): PlatformBackgroundJob {
    const now = new Date();

    const queued: PlatformBackgroundJob = {
      ...job,
      status: "queued",
      createdAt: now,
      updatedAt: now,
    };

    this.jobs.set(queued.id, queued);
    return queued;
  }

  updateStatus(id: string, status: PlatformJobStatus): void {
    const job = this.jobs.get(id);

    if (job) {
      job.status = status;
      job.updatedAt = new Date();
    }
  }

  list(): PlatformBackgroundJob[] {
    return [...this.jobs.values()];
  }
}