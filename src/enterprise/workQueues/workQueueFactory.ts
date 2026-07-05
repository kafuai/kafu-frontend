import type { WorkQueue } from "./workQueue";

export interface CreateWorkQueueOptions {
  id: string;
  name: string;
  domain: string;
}

export function createWorkQueue(
  options: CreateWorkQueueOptions,
): WorkQueue {
  return {
    id: options.id,
    name: options.name,
    domain: options.domain,
    items: [],
  };
}