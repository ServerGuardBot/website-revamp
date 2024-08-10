"use client";
import { Input, Paper, ScrollArea, Select, SimpleGrid, Slider, Space, Stack, Switch, TagsInput, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { useServer } from "@/components/ServerContext";
import { useTranslations } from "next-intl";

import classes from "../page.module.css";
import { IconInfoCircle, IconStar } from "@tabler/icons-react";

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("verification");
  const tg = useTranslations("general");
  return (
    <ScrollArea.Autosize h="100%">
      <div className={classes.main}>
        <Stack gap="xs" w="100%">
          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{tg("settings")}</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label={t("verified_role.label")}
                  description={t("verified_role.description")}
                  value={server.serverData?.verified_role || "0"}
                  data={server?.mappedRoles}
                  onChange={(value) => {
                    server.updateConfig("verified_role", value);
                  }}
                />
                <Select
                  label={t("unverified_role.label")}
                  description={t("unverified_role.description")}
                  value={server.serverData?.unverified_role || "0"}
                  data={server?.mappedRoles}
                  onChange={(value) => {
                    server.updateConfig("unverified_role", value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label={t("channel.label")}
                  description={t("channel.description")}
                  value={server.serverData?.verification_channel || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("verification_channel", value);
                  }}
                />
                <Select
                  label={t("logs.label")}
                  description={t("logs.description")}
                  value={server.serverData?.logs_verification || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("logs_verification", value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1 }}>
                <TextInput
                  label={t("admin_contact.label")}
                  description={t("admin_contact.description")}
                  value={server.serverData?.admin_contact || ""}
                  onChange={(event) => {
                    server.updateConfig("admin_contact", event.currentTarget.value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                <Input.Wrapper>
                  <Input.Label>{t("block_tor.label")}</Input.Label>
                  <Input.Description>{t("block_tor.description")}</Input.Description>
                  <Switch
                    checked={server.serverData?.block_tor || false}
                    onChange={(e) => {
                      server.updateConfig("block_tor", e.currentTarget.checked);
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip label={tg("premium_feature")}>
                        <IconStar color="var(--mantine-color-yellow-3)" size="1.1rem" stroke=".15rem" />
                      </Tooltip>
                    </div>
                    <Space w={4} />
                    {t("proxy_check.label")}
                  </Input.Label>
                  <Input.Description>{t("proxy_check.description")}</Input.Description>
                  <Switch
                    checked={server.serverData?.check_ips || true}
                    onChange={(e) => {
                      server.updateConfig("check_ips", e.currentTarget.checked);
                    }}
                    disabled={!server.sessionGuild?.isPremium}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip label={tg("coming_soon")}>
                        <IconInfoCircle
                          color="var(--mantine-color-dark-2)"
                          size="1.1rem"
                          stroke=".15rem"
                        />
                      </Tooltip>
                    </div>
                    <Space w={4} />
                    {t("raid_guard.label")}
                  </Input.Label>
                  <Input.Description>{t("raid_guard.description")}</Input.Description>
                  <Switch
                    checked={server.serverData?.raid_guard || false}
                    onChange={(e) => {
                      server.updateConfig("raid_guard", e.currentTarget.checked);
                    }}
                    disabled={true}
                    mt="xs"
                  />
                </Input.Wrapper>
              </SimpleGrid>
            </Stack>
          </Paper>
          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{t("rule_enforcement.label")}</Title>
              <Text c="dimmed">{t("rule_enforcement.description")}</Text>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Input.Wrapper>
                  <Input.Label>{t("toxicity")}</Input.Label>
                  <Slider
                    value={server.serverData?.re_toxicity || 0}
                    onChange={(value) => {
                      server.updateConfig("re_toxicity", value);
                    }}
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label>{t("hate-speech")}</Input.Label>
                  <Slider
                    value={server.serverData?.re_hatespeech}
                    onChange={(value) => {
                      server.updateConfig("re_hatespeech", value);
                    }}
                  />
                </Input.Wrapper>
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1 }}>
                <Input.Wrapper>
                  <Input.Label>
                    <div style={{display: "flex", justifyContent: "center"}}>
                      <Tooltip label={tg("premium_feature")}>
                        <IconStar color="var(--mantine-color-yellow-3)" size="1.1rem" stroke=".15rem" />
                      </Tooltip>
                      <Space w={4} />
                      {t("nsfw.label")}
                    </div>
                  </Input.Label>
                  <Input.Description>
                    {t("nsfw.description")}
                  </Input.Description>
                  <Slider
                    disabled={!server.sessionGuild?.isPremium}
                    value={server.serverData?.re_nsfw}
                    onChange={(value) => {
                      server.updateConfig("re_nsfw", value);
                    }}
                  />
                </Input.Wrapper>
                <TagsInput
                  label={t("blacklist.label")}
                  description={t("blacklist.description")}
                  value={server.serverData?.re_blacklist || []}
                  onChange={(value) => {
                    server.updateConfig("re_blacklist", value);
                  }}
                />
              </SimpleGrid>
            </Stack>
          </Paper>
        </Stack>
      </div>
    </ScrollArea.Autosize>
  );
}
