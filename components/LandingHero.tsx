"use client";
import { Button, Container, Group, Text } from "@mantine/core";
import { useTranslations } from "next-intl";
import classes from "./LandingHero.module.css";

export default function LandingHero() {
  const t = useTranslations("home");
  return (
    <div className={classes.wrapper}>
      <Container size="lg">
        <div className={classes.inner}>
          <div className={classes.content}>
            <h1 className={classes.title}>
              {t.rich("hero-title", {
                gradient: (chunks) => (
                  <Text
                    component="span"
                    variant="gradient"
                    gradient={{ from: "goldenrod", to: "gold" }}
                    inherit
                  >
                    {chunks}
                  </Text>
                ),
              })}
            </h1>

            <Text className={classes.description} size="lg" c="dimmed">
              {t.rich("hero-description")}
            </Text>

            <Group className={classes.controls}>
              <Button
                size="xl"
                className={classes.control}
                component="a"
                href="https://www.guilded.gg/b/2b2fa670-37c9-453c-8b35-5473fe932e6f"
                variant="gradient"
                gradient={{ from: "goldenrod", to: "gold" }}
              >
                {t("cta-invite")}
              </Button>
            </Group>
          </div>
        </div>
      </Container>
    </div>
  );
}
