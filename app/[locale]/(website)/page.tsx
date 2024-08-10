import LandingFAQ from "@/components/LandingFAQ";
import LandingHero from "@/components/LandingHero";
import LandingStatistics from "@/components/LandingStatistics";
import LandingTrusted from "@/components/LandingTrusted";
import LandingFeatures from "@/components/LandingFeatures";
import LandingCTA from "@/components/LandingCTA";

import styles from "./page.module.css";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";

const statsRequest = new ServerGuardRequest("/stats", "GET");

export default async function Home() {
  let statsResponse = undefined;
  try {
    statsResponse = await statsRequest.execute();
    if (typeof statsResponse !== "object") {
      statsResponse = undefined;
    }
  } catch (e) {
    console.log(e);
    throw new Error("Failed to fetch stats");
  }

  return (
    <>
      <LandingHero />
      <LandingStatistics stats={statsResponse} />
      <LandingTrusted />
      <LandingFeatures />
      <LandingFAQ />
      <LandingCTA />
    </>
  );
}
