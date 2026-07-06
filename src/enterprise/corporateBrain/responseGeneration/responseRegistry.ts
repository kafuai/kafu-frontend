import { EnterpriseResponse } from "./responseTypes";

export class ResponseRegistry {
  private readonly responses = new Map<string, EnterpriseResponse>();

  register(response: EnterpriseResponse): void {
    this.responses.set(response.id, response);
  }

  get(id: string): EnterpriseResponse | undefined {
    return this.responses.get(id);
  }

  getAll(): EnterpriseResponse[] {
    return [...this.responses.values()];
  }

  remove(id: string): boolean {
    return this.responses.delete(id);
  }

  clear(): void {
    this.responses.clear();
  }
}