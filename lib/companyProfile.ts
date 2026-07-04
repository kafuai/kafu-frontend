import { CompanyProfile } from "@/types/corporateDNA";

type CompanyInput = {
  name: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
};

export function mapCompanyToProfile(company: CompanyInput): CompanyProfile {
  return {
    name: company.name,
    industry: company.industry,
    country: company.country,
    employeeCount: company.employee_count,
  };
}