export interface LicensePolicy {
  id: string;
  name: string;
  enforceSeatLimit: boolean;
  allowOverage: boolean;
  gracePeriodDays?: number;
}
