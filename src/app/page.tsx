import { Hero } from "@/components/landing/Hero";
import { ProblemSolution } from "@/components/landing/ProblemSolution";
import { StatsSection } from "@/components/landing/StatsSection";
import { ProgramSection } from "@/components/landing/ProgramSection";
import { BenefitsSection } from "@/components/landing/BenefitsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { FinalCta } from "@/components/landing/FinalCta";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col overflow-x-hidden">
      <Hero />
      <ProblemSolution />
      <StatsSection />
      <ProgramSection />
      <BenefitsSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </main>
  );
}
