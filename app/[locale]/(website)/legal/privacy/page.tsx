"use client";
import LegalNotice from "@/components/LegalNotice";
import { List, Text, Title } from "@mantine/core";
import { useTranslations } from "next-intl";

export default function Page() {
  const tg = useTranslations("general");
  const t = useTranslations("privacy");
  return (
    <>
      <Title>{tg("privacy")}</Title>
      <LegalNotice />
      <Text>{t("intro")}</Text>
      <Text mt="sm">{t("verification")}</Text>
      <List withPadding>
        <List.Item>{t("verification-username")}</List.Item>
        <List.Item>{t("verification-metrics")}</List.Item>
        <List.Item>{t("verification-connection")}</List.Item>
      </List>

      <Text mt="sm">{t("hashing")}</Text>
      <Text mt="sm">{t("analytics")}</Text>
      <Text mt="sm">{t("agreement")}</Text>
      <Text mt="sm">{t("filters")}</Text>
    </>
  );
}
