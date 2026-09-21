import { CommercialHero } from "./CommercialHero";
import { CommercialModels } from "./CommercialModels";
import { CommercialOffer } from "./CommercialOffer";
import { CommercialCTA } from "./CommercialCTA";

export function CommercialPackaging() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <CommercialHero />
      <CommercialModels />
      <CommercialOffer />
      <CommercialCTA />
    </main>
  );
}
