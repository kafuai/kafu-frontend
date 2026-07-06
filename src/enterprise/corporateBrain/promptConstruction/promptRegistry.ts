import { PromptTemplate } from "./promptTemplate";

export class PromptRegistry {
  private readonly templates = new Map<string, PromptTemplate>();

  register(template: PromptTemplate): void {
    this.templates.set(template.id, template);
  }

  get(id: string): PromptTemplate | undefined {
    return this.templates.get(id);
  }

  getAll(): PromptTemplate[] {
    return [...this.templates.values()];
  }

  remove(id: string): boolean {
    return this.templates.delete(id);
  }

  clear(): void {
    this.templates.clear();
  }
}