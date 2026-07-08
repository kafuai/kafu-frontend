export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  published: boolean;
}

export function publishKnowledgeArticle(
  article: KnowledgeArticle,
): KnowledgeArticle {
  return {
    ...article,
    published: true,
  };
}
