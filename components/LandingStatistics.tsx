"use client";
import { Container, Group, Stack, Text, rem } from "@mantine/core";
import classes from "./LandingStatistics.module.css";
import AnimatedNumbers from "react-animated-numbers";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslations } from "next-intl";

function Statistic({ name, value }: { name: string; value: number }) {
  return (
    <Container key={name.toLowerCase()}>
      <Text ta="center" size={rem(26)} fw={600}>
        {name}
      </Text>
      <Text className={classes.animatedText} ta="center" size={rem(20)} mt={6}>
        <AnimatedNumbers
          includeComma
          animateToNumber={value}
          className={classes.animatedNumber}
        />+
      </Text>
    </Container>
  );
}

export default function LandingStatistics({ stats }: {
  stats?: {
    verifications: number;
    users: number;
    servers: number;
  }
}) {
  if (stats == undefined) {
    stats = {
      verifications: 2034,
      users: 62894,
      servers: 1649,
    };
  }

  const t = useTranslations("general");

  const isSmallScreen = useMediaQuery("(max-width: 62em)");
  const Container = isSmallScreen ? Stack : Group;

  return (
    <Container className={classes.statisticsGroup} mt={14} grow>
      <Statistic name={t("verifications")} value={stats.verifications} />
      <Statistic name={t("users")} value={stats.users} />
      <Statistic name={t("servers")} value={stats.servers} />
    </Container>
  );
}
