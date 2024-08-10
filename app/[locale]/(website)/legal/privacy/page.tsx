"use client";
import LegalNotice from "@/components/LegalNotice";
import { List, Space, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function Page() {
  const tg = useTranslations("general");
  const t = useTranslations("privacy");
  return (
    <>
      <Title>{tg("privacy")}</Title>
      <LegalNotice />
      <Text>{t("intro")}</Text>
      <Space h="sm" />
      <Text>{t("verification")}</Text>
      <List withPadding>
        <List.Item>{t("verification-username")}</List.Item>
        <List.Item>{t("verification-metrics")}</List.Item>
        <List.Item>{t("verification-connection")}</List.Item>
      </List>

      <Space h="sm" />
      <Text>{t("hashing")}</Text>
      <Space h="sm" />
      <Text>{t("analytics")}</Text>
      <Space h="sm" />
      <Text>{t("agreement")}</Text>
      <Space h="sm" />
      <Text>{t("filters")}</Text>
    </>
  );
}
