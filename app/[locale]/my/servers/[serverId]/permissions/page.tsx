"use client";
import { Box, Button, Group, Input, ScrollArea, Space, Stack, Switch, Text, Title } from "@mantine/core";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { useServer } from "@/components/ServerContext";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import classes from "../page.module.css";
import {default as permClasses} from "./page.module.css";

const permList = {
  "Management": [
    "ManageVerification",
    "ManageXP",
    "ManageModeration",
    "ManageAutoMod",
    "ManageLogging",
    "ManageWelcomer",
    "ManageAutoroles",
    "ManageFeeds",
    "ManageGiveaways",
    "ManageAutomations",
    "ManageBot",
  ],
  "Commands": [
    "CommandsBan",
    "CommandsKick",
    "CommandsMute",
    "CommandsBypass",
    "CommandsWarn",
    "CommandsEvaluate",
    "CommandsUserInfo",
    "CommandsServerInfo",
    "CommandsPurge",
    "CommandsNote",
    "HostGiveaways",
  ],
  "General": [
    "BypassFilter",
    "IsTrusted",
    "ViewAuditLogs",
  ]
};

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("permissions");

  const [permissions, setPermissions] = useState<{
    [roleId: string]: string[];
  }>({});

  const [activeRole, setActiveRole] = useState<string | undefined>();

  useEffect(() => {
    const req = new ServerGuardRequest(
      `/servers/${serverId}/permissions`,
      "GET"
    );
    req.execute().then((data) => {
      setPermissions(data.permissions);
    });
  }, [serverId]);

  useEffect(() => {
    for (const [roleId, data] of Object.entries(server?.serverData?.roles!)) {
      if (data.base) continue;
      setActiveRole(roleId);
      break;
    }
  }, [server?.serverData?.roles]);

  let roles = [];
  for (const [roleId, data] of Object.entries(server?.serverData?.roles!)) {
    if (data.base) continue;
    roles.push(<ServerRole
      roleId={roleId}
      roleName={data.name}
      roleColor={
        data.color.length > 1 && { from: data.color[0], to: data.color[1], deg: 90 } ||
        data.color[0] ||
        "var(--mantine-color-text)"}
      active={activeRole == roleId}
      onClick={() => setActiveRole(roleId)}
    />);
  }

  let perms = [];
  for (const [category, categoryPermissions] of Object.entries(permList)) {
    perms.push((
      <>
        <Title order={4}>{t(`categories.${category}`)}</Title>
        <Space h="xs" />
        <Stack gap="xs">
          {categoryPermissions.map((perm) => (
            <Switch
              size="md"
              key={perm}
              label={t(`perms.${perm}`)}
              checked={(permissions[activeRole || "unknown"] || []).includes(perm)}
              onChange={(e) => {
                const newPerms = [...(permissions[activeRole || "unknown"] || [])];
                if (e.target.checked) {
                  newPerms.push(perm);
                } else {
                  newPerms.splice(newPerms.indexOf(perm), 1);
                }
                let updatedPerms;
                if (newPerms.length == 0) {
                  updatedPerms = { ...permissions };
                  delete updatedPerms[activeRole || "unknown"];
                } else {
                  updatedPerms = { ...permissions, [activeRole || "unknown"]: newPerms };
                }
                console.log(updatedPerms);
                setPermissions(updatedPerms);
                if (Object.keys(updatedPerms).length == 0) {
                  server.updateConfig(
                    "permissions",
                    undefined
                  );
                } else {
                  server.updateConfig(
                    "permissions",
                    updatedPerms
                  );
                }
              }}
            />
          ))}
        </Stack>
        <Space h="xs" />
      </>
    ))
  }

  return (
    <div className={classes.main}>
      <Group h="100%" w="100%">
        <div className={permClasses.rolesArea}>
          <ScrollArea.Autosize h="100%">
            <Stack gap="xs">
              {roles}
            </Stack>
          </ScrollArea.Autosize>
        </div>
        <div className={permClasses.permsArea}>
          <ScrollArea.Autosize h="100%">
            <Stack gap={0}>
              {perms}
            </Stack>
          </ScrollArea.Autosize>
        </div>
      </Group>
    </div>
  );
}

function ServerRole({
  roleId,
  roleName,
  roleColor,
  active,
  onClick,
}: {
  roleId: string;
  roleName: string;
  roleColor: any;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="subtle"
      ta="left"
      styles={{
        inner: {
          width: "100%",
        },
        label: {
          width: "100%",
        }
      }}
      className={active ? permClasses.activeRole : undefined}
      onClick={onClick}
    >
      <Text
        w="100%"
        c={typeof roleColor == "string" && roleColor || undefined}
        gradient={typeof roleColor == "object" && roleColor || undefined}
        variant={typeof roleColor == "object" && "gradient" || undefined}
        ff="inherit"
        fw="inherit"
        fs="inherit"
        lh="inherit"
        ta="inherit"
      >
        {roleName}
      </Text>
    </Button>
  )
}
