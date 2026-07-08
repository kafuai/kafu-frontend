export interface SupplierCommunicationLog {
  supplierId: string;
  channel: string;
  message: string;
  timestamp: string;
}

export function createSupplierCommunication(
  log: SupplierCommunicationLog
): SupplierCommunicationLog {
  return {
    ...log,
    timestamp: log.timestamp || new Date().toISOString(),
  };
}

export function isRecentSupplierCommunication(
  log: SupplierCommunicationLog
): boolean {
  const difference =
    Date.now() - new Date(log.timestamp).getTime();

  return difference < 1000 * 60 * 60 * 24 * 30;
}
