import { LandingHero } from "./LandingHero";
import { LandingAudience } from "./LandingAudience";
import { LandingProblem } from "./LandingProblem";
import { LandingValue } from "./LandingValue";
import { LandingPlatform } from "./LandingPlatform";
import { LandingBenefits } from "./LandingBenefits";
import { LandingOutcomes } from "./LandingOutcomes";
import { LandingCTA } from "./LandingCTA";
import BookDemoForm from "@/app/book-demo/page";
import { LandingFAQ } from "./LandingFAQ";
import { LandingFooter } from "./LandingFooter";
import { LandingPilot } from "./LandingPilot";
import { LandingPricing } from "./LandingPricing";

export function LandingPage() {
  return (
    <main
      className="min-h-screen bg-[var(--landing-bg-primary)] text-[var(--landing-text-primary)]"
      dir="rtl"
    >
      <LandingHero />
      <LandingAudience />
      <LandingProblem />
      <LandingValue />
      <LandingPlatform />
      <LandingBenefits />
      <LandingOutcomes />
      <LandingPilot />
      <LandingFAQ />
      <LandingCTA />
    </main>
  );
}
