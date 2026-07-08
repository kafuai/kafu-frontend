export interface WorkspaceBranding {
  workspaceId: string;
  companyName: string;
  logoUrl?: string;
  primaryColor?: string;
}

export function updateWorkspaceBranding(
  branding: WorkspaceBranding,
): WorkspaceBranding {
  return branding;
}