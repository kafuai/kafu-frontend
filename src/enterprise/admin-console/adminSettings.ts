export interface AdminSettings {
  theme: string;
  language: string;
  notificationsEnabled: boolean;
}

export function createDefaultAdminSettings(): AdminSettings {
  return {
    theme: "system",
    language: "en",
    notificationsEnabled: true,
  };
}
