import { VendorReference } from "./vendorManagementTypes";

export interface Vendor extends VendorReference {
  categoryId: string;
  country: string;
  contactEmail: string;
}
