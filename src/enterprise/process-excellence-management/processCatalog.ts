import type { EnterpriseProcess } from "./processExcellenceTypes";

export const enterpriseProcessCatalog: EnterpriseProcess[] = [
  {
    id: "proc-order-to-cash",
    name: "Order to Cash",
    owner: "Revenue Operations",
    domain: "Finance",
    criticality: "mission_critical",
    maturity: "optimized",
    status: "healthy",
    automationCoverage: 82,
    cycleTimeHours: 18,
    defectRate: 1.7,
  },
  {
    id: "proc-procure-to-pay",
    name: "Procure to Pay",
    owner: "Procurement",
    domain: "Supply Chain",
    criticality: "high",
    maturity: "standardized",
    status: "watch",
    automationCoverage: 64,
    cycleTimeHours: 31,
    defectRate: 3.4,
  },
  {
    id: "proc-hire-to-retire",
    name: "Hire to Retire",
    owner: "Human Capital",
    domain: "People",
    criticality: "high",
    maturity: "managed",
    status: "at_risk",
    automationCoverage: 51,
    cycleTimeHours: 46,
    defectRate: 4.2,
  },
];

export function getProcessById(processId: string): EnterpriseProcess | undefined {
  return enterpriseProcessCatalog.find((process) => process.id === processId);
}

export function getMissionCriticalProcesses(): EnterpriseProcess[] {
  return enterpriseProcessCatalog.filter(
    (process) => process.criticality === "mission_critical"
  );
}
