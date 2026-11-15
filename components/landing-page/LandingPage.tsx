import { LandingHero } from "./LandingHero";
import { LandingProductShowcase } from "./LandingProductShowcase";
import { LandingPlatform } from "./LandingPlatform";
import { LandingAudience } from "./LandingAudience";
import { LandingBenefits } from "./LandingBenefits";
import { LandingPilot } from "./LandingPilot";
import { LandingFAQ } from "./LandingFAQ";
import { LandingCTA } from "./LandingCTA";

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
      <LandingHero />
      <LandingProductShowcase />
      <LandingPlatform />
      <LandingAudience />
      <LandingBenefits />
      <LandingPilot />
      <LandingFAQ />
      <LandingCTA />
    </main>
  );
}
