export interface ContractEngine {
  id: string;
  version: string;
  status: "online" | "offline" | "maintenance";
}
