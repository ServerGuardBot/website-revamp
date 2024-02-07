"use client";
import { Button, Container, Stack, Text, Title } from "@mantine/core";
import classes from "./LandingCTA.module.css";
import { useTranslations } from "next-intl";

export default function LandingCTA() {
  const t = useTranslations("home");
  return (
    <div className={classes.container}>
      <Container py={94}>
        <Stack align="center" justify="center" h="100%" gap={0}>
          <Title mb={0}>
            {t("cta-title")}
          </Title>
          <Text mt={8}>
            {t("cta-description")}
          </Text>
          <Button
            size="xl"
            mt="lg"
            mb="xl"
            component="a"
            href="https://www.guilded.gg/b/2b2fa670-37c9-453c-8b35-5473fe932e6f"
            variant="gradient"
            gradient={{ from: "goldenrod", to: "gold" }}
          >
            {t("cta-invite")}
          </Button>
        </Stack>
      </Container>
    </div>
  );
}
