"use client";
import { Container, Group, Stack, Text, rem } from "@mantine/core";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { useTranslations } from "next-intl";
import classes from "./LandingStatistics.module.css";

function Statistic({ name, value }: { name: string; value: number }) {
  const [curValue, setCurValue] = useState(Math.floor(value / 2));
  const intervalNum = Math.floor(value / 100);

  useEffect(() => {
    const interval = setInterval(() => {
      if (curValue < value) {
        setCurValue(Math.min(curValue + intervalNum, value));
      }
    }, 20);

    return () => clearInterval(interval);
  }, [curValue, value, intervalNum]);

  return (
    <Container key={name.toLowerCase()}>
      <Text ta="center" size={rem(26)} fw={600}>
        {name}
      </Text>
      <Text ta="center" size={rem(20)} mt={6}>
        {curValue}+
      </Text>
    </Container>
  );
}

export default function LandingStatistics() {
  const data = {
    verifications: 2034,
    users: 62894,
    servers: 1649,
  };

  const t = useTranslations("general");

  const isSmallScreen = useMediaQuery("(max-width: 62em)");
  const Container = isSmallScreen ? Stack : Group;

  return (
    <Container className={classes.statisticsGroup} mt={14} grow>
      <Statistic name={t("verifications")} value={data.verifications} />
      <Statistic name={t("users")} value={data.users} />
      <Statistic name={t("servers")} value={data.servers} />
    </Container>
  );
}
