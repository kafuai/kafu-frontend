export interface VendorAssessment {
  id: string;
  vendorId: string;
  assessmentType: string;
  score: number;
  notes?: string;
}
