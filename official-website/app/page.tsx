import CapabilitySection from "@/components/home/CapabilitySection";
import EnterpriseTrustSection from "@/components/home/EnterpriseTrustSection";
import ExecutiveCTA from "@/components/home/ExecutiveCTA";
import HomeHero from "@/components/home/HomeHero";
import PlatformValueSection from "@/components/home/PlatformValueSection";
import TransformationSection from "@/components/home/TransformationSection";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <PlatformValueSection />
      <CapabilitySection />
      <TransformationSection />
      <EnterpriseTrustSection />
      <ExecutiveCTA />
    </>
  );
}
