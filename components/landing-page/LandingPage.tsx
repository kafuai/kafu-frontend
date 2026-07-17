import { LandingHero } from "./LandingHero";
import { LandingAudience } from "./LandingAudience";
import { LandingProblem } from "./LandingProblem";
import { LandingValue } from "./LandingValue";
import { LandingPlatform } from "./LandingPlatform";
import { LandingBenefits } from "./LandingBenefits";
import { LandingOutcomes } from "./LandingOutcomes";
import { LandingCTA } from "./LandingCTA";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <LandingHero />
      <LandingAudience />
      <LandingProblem />
      <LandingValue />
      <LandingPlatform />
      <LandingBenefits />
      <LandingOutcomes />
      <LandingCTA />
    </main>
  );
}
