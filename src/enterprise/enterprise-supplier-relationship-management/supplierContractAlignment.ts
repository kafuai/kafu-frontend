export interface SupplierContractAlignment {
  supplierId: string;
  contractId: string;
  aligned: boolean;
  obligationsMatched: number;
  obligationsTotal: number;
}

export function calculateContractAlignment(
  alignment: SupplierContractAlignment
): number {
  if (!alignment.obligationsTotal) return 0;

  return Math.round(
    (alignment.obligationsMatched /
      alignment.obligationsTotal) *
      100
  );
}

export function isContractAligned(
  alignment: SupplierContractAlignment
): boolean {
  return alignment.aligned;
}
