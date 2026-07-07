import { ProcurementRequest } from "./procurementRequest";

export class ProcurementRegistry {
  private readonly requests = new Map<string, ProcurementRequest>();

  register(request: ProcurementRequest): void {
    this.requests.set(request.id, request);
  }

  get(id: string): ProcurementRequest | undefined {
    return this.requests.get(id);
  }

  list(): ProcurementRequest[] {
    return Array.from(this.requests.values());
  }
}