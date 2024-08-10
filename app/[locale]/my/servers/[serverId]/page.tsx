"use client";
import { Paper, ScrollArea, Select, SimpleGrid, Stack, TextInput } from "@mantine/core";
import { useServer } from "@/components/ServerContext";
import { useTranslations } from "next-intl";
import { LANGUAGES } from "@/localization/constants";

import classes from "./page.module.css";
import { CheckboxCard } from "@/components/CheckboxCard";
import { useEffect, useState } from "react";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";

interface Module {
  name: string;
  description: string;
}

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const t = useTranslations("dashboard_index")
  const tl = useTranslations("locales");
  const server = useServer();

  const [modules, setModules] = useState<Module[]>([]);
  useEffect(() => {
    const req = new ServerGuardRequest(`/modules`, "GET");
    req.execute(undefined, false).then((data) => {
      setModules(data.modules);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <ScrollArea.Autosize h="100%">
      <div className={classes.main}>
        <Paper px="md" py="xs" withBorder className={classes.paper}>
          <Stack gap="xs">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput
                label={t("nickname")}
                value={server.serverData?.nickname || "Server Guard"}
                onChange={(event) => {
                  server.updateConfig("nickname", event.currentTarget.value);
                }}
              />
              <Select
                label={t("timezone")}
                searchable
                value={server.serverData?.timezone || "Australia/Sydney"}
                onChange={(value) => {
                  server.updateConfig("timezone", value);
                }}
                error={server.failedChanges?.timezone}
                data={
                  Intl.supportedValuesOf("timeZone").map((tz) => ({
                    value: tz,
                    label: tz,
                  }))
                }
              />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Select
                searchable
                label={t("language.label")}
                description={t("language.description")}
                value={server.serverData?.language || "en"}
                onChange={(value) => {
                  server.updateConfig("language", value);
                }}
                error={server.failedChanges?.language}
                data={
                  LANGUAGES.map((l) => ({
                    value: l,
                    label: tl(l),
                  }))
                }
              />
              <Select
                searchable
                label={t("muted_role.label")}
                description={t("muted_role.description")}
                value={server.serverData?.muted_role || "0"}
                onChange={(value) => {
                  server.updateConfig("muted_role", value);
                }}
                error={server.failedChanges?.muted_role}
                data={server?.mappedRoles}
              />
            </SimpleGrid>
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <TextInput
                label={t("prefix.label")}
                description={t("prefix.description")}
                value={server.serverData?.prefix || "/"}
                onChange={(event) => {
                  server.updateConfig("prefix", event.currentTarget.value);
                }}
                error={server.failedChanges?.prefix}
              />
            </SimpleGrid>
          </Stack>
        </Paper>
        <Paper withBorder p="xs" shadow="sm" className={classes.paper}>
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing="xs"
            >
              {modules.map((data) => {
                const mod = data.name;
                let name = mod.toLowerCase();
                return (
                  <CheckboxCard
                    title={t(`modules.${name}.name`)}
                    description={t(`modules.${name}.description`)}
                    value={server.serverData?.modules.includes(mod) || false}
                    stateChanged={(state) => {
                      console.log(state);
                      let updatedModules = [];
                      for (const m of modules) {
                        if (m.name !== mod && server.serverData?.modules.includes(m.name)) {
                          updatedModules.push(m.name);
                        } else if (m.name == mod && state) {
                          updatedModules.push(m.name);
                        }
                      }
                      server.updateConfig("modules", updatedModules);
                    }}
                    key={mod}
                  />
                );
              })}
            </SimpleGrid>
          </Paper>
      </div>
    </ScrollArea.Autosize>
  );
}
