"use client";
import { Input, Paper, ScrollArea, Select, SimpleGrid, Slider, Space, Stack, Switch, TagsInput, Text, TextInput, Title, Tooltip } from "@mantine/core";
import { useServer } from "@/components/ServerContext";
import { IconStar } from "@tabler/icons-react";
import { useTranslations } from "next-intl";

import classes from "../page.module.css";

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("logging");
  const tg = useTranslations("general");
  return (
    <ScrollArea.Autosize h="100%">
      <div className={classes.main}>
        <Stack gap="xs" w="100%">
          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{tg("settings")}</Title>
              <SimpleGrid cols={{ base: 1, md: 3 }}>
                <Input.Wrapper>
                  <Input.Label>{t("commands.label")}</Input.Label>
                  <Input.Description>{t("commands.description")}</Input.Description>
                  <Switch
                    checked={server.serverData?.log_commands || false}
                    onChange={(e) => {
                      server.updateConfig("log_commands", e.currentTarget.checked);
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label>{t("silence_commands.label")}</Input.Label>
                  <Input.Description>{t("silence_commands.description")}</Input.Description>
                  <Switch
                    checked={server.serverData?.silence_commands || false}
                    onChange={(e) => {
                      server.updateConfig("silence_commands", e.currentTarget.checked);
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label>{t("roles.label")}</Input.Label>
                  <Input.Description>{t("roles.description")}</Input.Description>
                  <Switch
                    checked={server.serverData?.log_roles || false}
                    onChange={(e) => {
                      server.updateConfig("log_roles", e.currentTarget.checked);
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label={t("messages.label")}
                  description={t("messages.description")}
                  value={server.serverData?.logs_message || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("logs_message", value);
                  }}
                />
                <Select
                  label={t("traffic.label")}
                  description={t("traffic.description")}
                  value={server.serverData?.logs_traffic || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("logs_traffic", value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label={t("users.label")}
                  description={t("users.description")}
                  value={server.serverData?.logs_user || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("logs_user", value);
                  }}
                />
                <Select
                  label={t("management.label")}
                  description={t("management.description")}
                  value={server.serverData?.logs_management || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("logs_management", value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Select
                  label={t("actions.label")}
                  description={t("actions.description")}
                  value={server.serverData?.logs_action || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("logs_action", value);
                  }}
                />
                <Select
                  label={
                    <div style={{display: "flex", justifyContent: "center"}}>
                      <Tooltip label={tg("premium_feature")}>
                        <IconStar color="var(--mantine-color-yellow-3)" size="1.1rem" stroke=".15rem" />
                      </Tooltip>
                      <Space w={4} />
                      {t("nsfw.label")}
                    </div>
                  }
                  description={t("nsfw.description")}
                  value={server.serverData?.logs_nsfw || "0"}
                  data={server?.textChannels}
                  disabled={!server.sessionGuild?.isPremium}
                  onChange={(value) => {
                    server.updateConfig("logs_nsfw", value);
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
