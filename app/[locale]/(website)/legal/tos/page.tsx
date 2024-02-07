"use client";
import { List, Text, Title } from "@mantine/core";
import classes from "./page.module.css";
import LegalNotice from "@/components/LegalNotice";
import { useTranslations } from "next-intl";

export default function Page() {
  const tg = useTranslations("general");
  const t = useTranslations("terms");
  return (
    <>
      <Title>{tg("terms")}</Title>
      <LegalNotice />
      <Text>
        {t.rich("intro")}
      </Text>
      <List type="ordered" className={classes.terms} fz={26}>
        <List.Item>
          <Title order={2}>{t("liability")}</Title>
          <Text>
            {t("liability-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("ip")}</Title>
          <Text>
            {t("ip-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("termination")}</Title>
          <Text>
            {t("termination-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("changes")}</Title>
          <Text>
            {t("changes-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("warranty")}</Title>
          <Text>
            {t("warranty-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("disputes")}</Title>
          <Text>
            {t("disputes-text")}
          </Text>
          <Text mt="sm">
            {t.rich("disputes-text-2")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("links")}</Title>
          <Text>
            {t("links-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("law")}</Title>
          <Text>
            {t("law-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("acknowledgement")}</Title>
          <Text>
            {t("acknowledgement-text")}
          </Text>
        </List.Item>
        <List.Item>
          <Title order={2}>{t("contact")}</Title>
          <Text>
            {t.rich("contact-text")}
          </Text>
        </List.Item>
      </List>
    </>
  );
}
