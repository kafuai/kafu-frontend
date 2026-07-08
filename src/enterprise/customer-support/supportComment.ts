export interface SupportComment {
  id: string;
  ticketId: string;
  authorId: string;
  body: string;
  internal: boolean;
  createdAt: Date;
}

export function createSupportComment(
  comment: SupportComment,
): SupportComment {
  return comment;
}
