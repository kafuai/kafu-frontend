export interface LicenseNotification {
  id: string;
  licenseId: string;
  type: "expiry" | "overage" | "renewal" | "suspension";
  recipient: string;
  scheduledAt: string;
  sent: boolean;
}
