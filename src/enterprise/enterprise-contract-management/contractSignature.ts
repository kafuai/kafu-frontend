export interface ContractSignature {
  id: string;
  contractId: string;
  signer: string;
  signedAt?: string;
  method: "electronic" | "physical";
  status: "pending" | "signed";
}
