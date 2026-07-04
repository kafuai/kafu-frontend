import { CommunicationTemplate } from "./communicationTemplate";

export class CommunicationTemplateRegistry {
  private readonly templates = new Map<string, CommunicationTemplate>();

  register(template: CommunicationTemplate): void {
    this.templates.set(template.id, template);
  }

  get(id: string): CommunicationTemplate | undefined {
    return this.templates.get(id);
  }

  list(): CommunicationTemplate[] {
    return [...this.templates.values()];
  }

  remove(id: string): boolean {
    return this.templates.delete(id);
  }
}