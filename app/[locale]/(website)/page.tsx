import LandingFAQ from "@/components/LandingFAQ";
import styles from "./page.module.css";
import LandingHero from "@/components/LandingHero";
import LandingStatistics from "@/components/LandingStatistics";
import LandingTrusted from "@/components/LandingTrusted";
import LandingFeatures from "@/components/LandingFeatures";
import LandingCTA from "@/components/LandingCTA";

export default function Home() {
  return (
    <>
      <LandingHero />
      <LandingStatistics />
      <LandingTrusted />
      <LandingFeatures />
      <LandingFAQ />
      <LandingCTA />
    </>
  );
}
