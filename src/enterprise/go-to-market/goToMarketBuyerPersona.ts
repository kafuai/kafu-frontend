export interface BuyerPersona {
  id: string;
  role: string;
  responsibilities: string[];
  challenges: string[];
  buyingMotivations: string[];
  decisionCriteria: string[];
}

export function createBuyerPersona(
  persona: BuyerPersona,
): BuyerPersona {
  return persona;
}