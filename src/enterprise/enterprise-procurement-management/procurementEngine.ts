import { ProcurementAmount } from "./procurementTypes";
import { ProcurementRequest } from "./procurementRequest";
import { ProcurementMetrics } from "./procurementMetrics";

export class ProcurementEngine {
  calculateApprovalRate(approvedRequests: number, totalRequests: number): number {
    if (totalRequests <= 0) {
      return 0;
    }

    return (approvedRequests / totalRequests) * 100;
  }

  calculateTotalSpend(amounts: ProcurementAmount[]): ProcurementAmount {
    const currency = amounts[0]?.currency ?? "USD";

    return {
      value: amounts.reduce((total, amount) => total + amount.value, 0),
      currency,
    };
  }

  createMetrics(
    requests: ProcurementRequest[],
    totalSpend: ProcurementAmount,
    averageApprovalTimeHours: number,
  ): ProcurementMetrics {
    return {
      totalRequests: requests.length,
      approvedRequests: requests.filter((request) => request.status === "approved").length,
      rejectedRequests: requests.filter((request) => request.status === "rejected").length,
      activePurchaseOrders: requests.filter((request) => request.status === "ordered").length,
      totalSpend,
      averageApprovalTimeHours,
    };
  }
}