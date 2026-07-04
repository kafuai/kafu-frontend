import { SchedulingJobDefinition } from "./schedulingTypes";

export class SchedulingJobRegistry {
  private readonly jobs = new Map<string, SchedulingJobDefinition>();

  register(job: SchedulingJobDefinition): SchedulingJobDefinition {
    if (this.jobs.has(job.id)) {
      throw new Error(`Scheduling job already registered: ${job.id}`);
    }

    this.jobs.set(job.id, job);
    return job;
  }

  update(job: SchedulingJobDefinition): SchedulingJobDefinition {
    if (!this.jobs.has(job.id)) {
      throw new Error(`Scheduling job not found: ${job.id}`);
    }

    const updatedJob: SchedulingJobDefinition = {
      ...job,
      updatedAt: new Date(),
    };

    this.jobs.set(job.id, updatedJob);
    return updatedJob;
  }

  get(jobId: string): SchedulingJobDefinition | undefined {
    return this.jobs.get(jobId);
  }

  list(): SchedulingJobDefinition[] {
    return Array.from(this.jobs.values());
  }

  listByOrganization(organizationId: string): SchedulingJobDefinition[] {
    return this.list().filter((job) => job.organizationId === organizationId);
  }

  remove(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  clear(): void {
    this.jobs.clear();
  }
}