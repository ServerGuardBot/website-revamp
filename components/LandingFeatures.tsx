"use client";
import {
  Title,
  Text,
  Card,
  ThemeIcon,
  SimpleGrid,
  Container,
  rem,
  Group,
} from "@mantine/core";
import {
  IconClipboardCheck,
  IconShieldCheck,
  IconUserCircle,
  IconMessageReport,
  IconBan,
  IconRobotFace,
} from "@tabler/icons-react";
import classes from "./LandingFeatures.module.css";
import { useTranslations } from "next-intl";

interface FeatureProps {
  icon: React.FC<any>;
  title: React.ReactNode;
  description: React.ReactNode;
}

function Feature({ icon: Icon, title, description }: FeatureProps) {
  return (
    <Card shadow="sm" p="lg" withBorder>
      <Group>
        <ThemeIcon variant="transparent" size={40}>
          <Icon size={rem(22)} />
        </ThemeIcon>

        <Title order={3}>{title}</Title>
      </Group>
      <Text size="sm" c="dimmed" mt="sm" lh={1.6}>
        {description}
      </Text>
    </Card>
  );
}

export default function LandingFeatures() {
  const t = useTranslations("home");
  return (
    <Container size="lg" p="xl" className={classes.container}>
      <Title ta="center">{t("features-title")}</Title>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing={{ base: "xl", md: 50 }}
        mt="md"
      >
        <Feature
          icon={IconClipboardCheck}
          title={t("features-checkpoint")}
          description={t("features-checkpoint-description")}
        />
        <Feature
          icon={IconShieldCheck}
          title={t("features-raid")}
          description={t("features-raid-description")}
        />
        <Feature
          icon={IconUserCircle}
          title={t("features-info")}
          description={t("features-info-description")}
        />
        <Feature
          icon={IconMessageReport}
          title={t("features-automod")}
          description={t("features-automod-description")}
        />
        <Feature
          icon={IconBan}
          title={t("features-moderation")}
          description={t("features-moderation-description")}
        />
        <Feature
          icon={IconRobotFace}
          title={t("features-automations")}
          description={t("features-automations-description")}
        />
      </SimpleGrid>
    </Container>
  );
}
