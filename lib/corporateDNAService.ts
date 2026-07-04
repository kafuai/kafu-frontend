import { buildCorporateDNA } from "@/lib/corporateDNA";
import { mapCompanyToProfile } from "@/lib/companyProfile";

type Company = {
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

type BuildCorporateDNAServiceInput = {
  company: Company;
  aiConfidence: number;
  dataQualityScore: number;
  maturityScore?: number;
};

export function generateCorporateDNA({
  company,
  aiConfidence,
  dataQualityScore,
  maturityScore,
}: BuildCorporateDNAServiceInput) {
  const profile = mapCompanyToProfile(company);

  return buildCorporateDNA({
    company: profile,
    aiConfidence,
    dataQualityScore,
    maturityScore,
  });
}