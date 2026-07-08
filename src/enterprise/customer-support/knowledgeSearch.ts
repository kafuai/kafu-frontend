import { KnowledgeArticle } from "./knowledgeArticle";

export function searchKnowledgeArticles(
  articles: KnowledgeArticle[],
  keyword: string,
): KnowledgeArticle[] {
  return articles.filter(
    (article) =>
      article.title.includes(keyword) ||
      article.content.includes(keyword),
  );
}
