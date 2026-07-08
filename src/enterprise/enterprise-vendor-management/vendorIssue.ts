export interface VendorIssue {
  id: string;
  vendorId: string;
  title: string;
  status: "open" | "in_progress" | "resolved" | "closed";
}
