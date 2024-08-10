"use client";
import {
  Card,
  Group,
  Input,
  NumberInput,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Title,
} from "@mantine/core";
import {
  useServer,
} from "@/components/ServerContext";
import { useTranslations } from "next-intl";

import classes from "../page.module.css";

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("xp");
  const tg = useTranslations("general");

  let cards = [];

  cards.push(
    <Card key="-1" withBorder className={classes.paper}>
      <Group justify="space-between">
        <Text size="sm" style={{ userSelect: "none" }}>
          @everyone
        </Text>
        <NumberInput
          value={
            (server.serverData?.xp_roles &&
              server.serverData?.xp_roles["-1"]) ||
            0
          }
          onChange={(value) => {
            server.updateConfig("xp_roles", {
              ...server.serverData?.xp_roles,
              ["-1"]: value,
            });
          }}
          placeholder={t("placeholder")}
        />
      </Group>
    </Card>
  );

  for (const [roleId, amount] of Object.entries(
    server.serverData?.xp_roles || {}
  )) {
    const role = server.serverData?.roles[Number.parseInt(roleId)];
    if (role) {
      cards.push(
        <Card key={roleId} withBorder className={classes.paper}>
          <Group justify="space-between">
            <Text
              size="sm"
              style={{ userSelect: "none" }}
              variant={(role.color.length > 1 && "gradient") || undefined}
              c={(role.color.length == 1 && role.color[0]) || undefined}
              gradient={
                (role.color.length > 1 && {
                  from: role.color[0],
                  to: role.color[1],
                  deg: 90,
                }) ||
                undefined
              }
            >
              {role.name}
            </Text>
            <NumberInput
              value={amount}
              onChange={(value) => {
                server.updateConfig("xp_roles", {
                  ...server.serverData?.xp_roles,
                  [roleId]: value,
                });
              }}
              placeholder={t("placeholder")}
            />
          </Group>
        </Card>
      );
    }
  }

  return (
    <ScrollArea.Autosize h="100%">
      <div className={classes.main}>
        <Stack gap="xs" w="100%">
          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{tg("settings")}</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    {t("remove_old.label")}
                  </Input.Label>
                  <Input.Description>
                    {t("remove_old.description")}
                  </Input.Description>
                  <Switch
                    checked={server.serverData?.remove_old_level_roles || false}
                    onChange={(e) => {
                      server.updateConfig(
                        "remove_old_level_roles",
                        e.currentTarget.checked
                      );
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    {t("announce_level_up.label")}
                  </Input.Label>
                  <Input.Description>
                    {t("announce_level_up.description")}
                  </Input.Description>
                  <Switch
                    checked={server.serverData?.announce_level_up || false}
                    onChange={(e) => {
                      server.updateConfig(
                        "announce_level_up",
                        e.currentTarget.checked
                      );
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
              </SimpleGrid>
              <Stack gap={0}>
                <Title order={2}>{t("xp_gain.label")}</Title>
                <Text c="dimmed">{t("xp_gain.description")}</Text>
              </Stack>
              <Stack gap="xs">
                {cards}
                <Select
                  data={server.mappedRoles?.filter(
                    ({value}) => !server.serverData?.xp_roles?.[value] && value != "-1" && value != "0"
                  )}
                  onChange={(value) => {
                    if (value) {
                        server.updateConfig("xp_roles", {
                            ...server.serverData?.xp_roles,
                            [value]: 0,
                          });
                    }
                  }}
                  placeholder={t("new")}
                  searchable
                  value={null}
                />
            </Stack>
            </Stack>
          </Paper>
        </Stack>
      </div>
    </ScrollArea.Autosize>
  );
}
