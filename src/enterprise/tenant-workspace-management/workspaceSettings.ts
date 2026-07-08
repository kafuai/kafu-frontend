export interface WorkspaceSettings {
  workspaceId: string;
  timezone: string;
  locale: string;
  dateFormat: string;
}

export function updateWorkspaceSettings(
  settings: WorkspaceSettings,
): WorkspaceSettings {
  return settings;
}