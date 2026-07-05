import styles from "./LandingPage.module.css";
import { ArchitectureSection } from "./sections/ArchitectureSection";
import { BuildInPublic } from "./sections/BuildInPublic";
import { CommunitySection } from "./sections/CommunitySection";
import { FaqSection } from "./sections/FaqSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { Hero } from "./sections/Hero";
import { ProblemSection } from "./sections/ProblemSection";
import { SiteFooter } from "./sections/SiteFooter";
import { SiteNav } from "./sections/SiteNav";
import { SolutionSection } from "./sections/SolutionSection";

export function LandingPage() {
  return (
    <div className={styles.page}>

      <SiteNav />

      <main className={styles.main}>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <BuildInPublic />
        <ArchitectureSection />
        <CommunitySection />
        <FaqSection />
      </main>

      <SiteFooter />
    </div>
  );
}
