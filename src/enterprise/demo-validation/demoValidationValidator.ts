import {
  DemoValidationCheck,
  DemoValidationReport,
} from "./demoValidationTypes";

export interface DemoValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateDemoValidationReport(
  report: DemoValidationReport,
): DemoValidationResult {
  const errors:string[]=[];
  const warnings:string[]=[];

  if(!report.organizationId.trim()) errors.push("Organization ID is required.");
  if(!report.companyName.trim()) errors.push("Company name is required.");
  if(report.checks.length===0) errors.push("Validation checks are required.");

  const ids=new Set<string>();

  report.checks.forEach((check:DemoValidationCheck)=>{
    if(ids.has(check.id)){
      errors.push(`Duplicate check ID: ${check.id}`);
    }
    ids.add(check.id);

    if(check.required &&
      check.status!=="passed" &&
      check.status!=="not-applicable"){
      warnings.push(`Required validation pending: ${check.title}`);
    }
  });

  return{
    valid:errors.length===0,
    errors,
    warnings,
  };
}

export function assertDemoValidationReportValid(
  report: DemoValidationReport,
):void{
  const result=validateDemoValidationReport(report);

  if(!result.valid){
    throw new Error(result.errors.join(" "));
  }
}
