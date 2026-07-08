export interface AdminSession {
  id: string;
  tenantId: string;
  actorId: string;
  startedAt: Date;
  expiresAt: Date;
}

export function isAdminSessionActive(session: AdminSession): boolean {
  return session.expiresAt.getTime() > Date.now();
}
