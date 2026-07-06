import {
  KnowledgeGraphRelation,
  createKnowledgeGraphRelation,
} from "./knowledgeGraphRelation";

export class KnowledgeGraphRelationRegistry {
  private readonly relations = new Map<string, KnowledgeGraphRelation>();

  register(relation: KnowledgeGraphRelation): void {
    this.relations.set(
      relation.id,
      createKnowledgeGraphRelation(relation),
    );
  }

  get(id: string): KnowledgeGraphRelation | undefined {
    return this.relations.get(id);
  }

  getAll(): readonly KnowledgeGraphRelation[] {
    return [...this.relations.values()];
  }

  remove(id: string): boolean {
    return this.relations.delete(id);
  }

  clear(): void {
    this.relations.clear();
  }

  count(): number {
    return this.relations.size;
  }
}