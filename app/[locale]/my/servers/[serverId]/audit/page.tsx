"use client";
import {
  MultiSelect,
  Pagination,
  Tooltip,
  Avatar,
  Stack,
  Paper,
  Group,
  Space,
  Text,
  Code,
  Card,
  Box,
  rem,
  ScrollArea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useServer } from "@/components/ServerContext";
import { useTranslations } from "next-intl";

import classes from "../page.module.css";
import { useEffect, useState } from "react";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { IconCalendar } from "@tabler/icons-react";

const logContentComponents: any = {
  update_setting: LogSettingUpdated,
};

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("audit_logs");
  const [auditLogInfo, setAuditLogInfo] = useState<{
    events: Array<{ label: string; value: string }>;
    users: Array<{ label: string; value: string }>;
    user_map: { [id: string]: any };
  }>({
    events: [],
    users: [],
    user_map: {},
  });

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [userFilter, setUserFilter] = useState<string[]>([]);
  const [eventFilter, setEventFilter] = useState<string[]>([]);

  const [logs, setLogs] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const [page, setPage] = useState(1);
  const limit = 50;

  useEffect(() => {
    setLoaded(false);
    let params = new URLSearchParams();
    if (dateRange[0]) {
      params.append("start", (dateRange[0].getTime() / 1000).toString());
    }
    if (dateRange[1]) {
      params.append("end", (dateRange[1].getTime() / 1000).toString());
    }
    if (userFilter.length > 0) {
      for (const user of userFilter) {
        params.append("author", user);
      }
    }
    if (eventFilter.length > 0) {
      for (const event of eventFilter) {
        params.append("event", event);
      }
    }
    params.append("limit", limit.toString());
    params.append("page", (page-1).toString());
    const req = new ServerGuardRequest(
      `/servers/${serverId}/audit?${params.toString()}`,
      "GET"
    );
    req.execute().then((data) => {
      setLogs(data.logs);
      setTotalLogs(data.total);
      setLoaded(true);
    });
  }, [eventFilter, userFilter, dateRange, serverId, page]);

  useEffect(() => {
    setPage(1);
  }, [eventFilter, userFilter, dateRange, serverId]);

  useEffect(() => {
    const auditLogInfoReq = new ServerGuardRequest(
      `/servers/${serverId}/audit/info`,
      "GET"
    );
    auditLogInfoReq.execute().then((data) => {
      let events: Array<{ label: string; value: string }> = [];
      for (const [key, value] of Object.entries(data.events)) {
        events.push({ label: value as string, value: key });
      }

      let user_map: { [id: string]: any } = {};

      for (const user of data.users) {
        user_map[user.id] = user;
      }

      let users: Array<{ label: string; value: string }> = [];

      for (const [key, value] of Object.entries(user_map)) {
        users.push({ label: value.name, value: key });
      }

      setAuditLogInfo({ events, users, user_map });
    });
  }, [serverId]);

  return (
    <div className={classes.main} style={{overflowY: "hidden"}}>
      <Stack gap="xs" w="100%" h="100%">
        <Paper px="md" py="xs" h={90} withBorder className={classes.paper}>
          <Group>
            <DatePickerInput
              type="range"
              label={t("filters.date.label")}
              placeholder={t("filters.date.placeholder")}
              leftSection={
                <IconCalendar
                  style={{ width: rem(18), height: rem(18) }}
                  stroke={1.5}
                />
              }
              value={dateRange}
              onChange={setDateRange}
              clearable
            />
            <MultiSelect
              data={auditLogInfo.events.map((value) => {
                return {
                  label: t(`filters.event_types.${value.value}`),
                  value: value.value,
                };
              })}
              label={t("filters.events.label")}
              placeholder={t("filters.events.placeholder")}
              searchable
              value={eventFilter}
              onChange={setEventFilter}
            />
            <MultiSelect
              data={auditLogInfo.users}
              label={t("filters.users.label")}
              placeholder={t("filters.users.placeholder")}
              searchable
              renderOption={({ option }) => {
                return (
                  <Group gap="sm">
                    <Avatar
                      src={auditLogInfo.user_map[option.value].avatar}
                      size="sm"
                    />
                    <Text size="sm">{option.label}</Text>
                  </Group>
                );
              }}
              value={userFilter}
              onChange={setUserFilter}
            />
          </Group>
        </Paper>
        <Box style={{display: "flex", flexDirection: "column"}} h="100%">
          <ScrollArea.Autosize h={`calc(100% - ${rem(134)} - var(--mantine-spacing-xs))`}>
            <Stack gap="xs">
              {
                logs.length == 0 &&
                <Text ta="center" size="md" fw={500}>
                  {t("no-logs")}
                </Text> ||
                loaded &&
                  Object.keys(auditLogInfo.user_map).length > 0 &&
                  logs.map((log) => {
                    return (
                      <AuditLogItem
                        key={log.id}
                        data={log}
                        user_map={auditLogInfo.user_map}
                      />
                    );
                  })
              }
            </Stack>
          </ScrollArea.Autosize>
          <Space h="xs" />
          <Group justify="center" h={44}>
            <Pagination
              total={Math.ceil(totalLogs / limit)}
              onChange={setPage}
              value={page}
              withEdges
            />
          </Group>
        </Box>
      </Stack>
    </div>
  );
}

function AuditLogItem({
  data,
  user_map,
}: {
  data: any;
  user_map: { [id: string]: any };
}) {
  let created = new Date(data.created_at);
  let originator = user_map[data.originator_id];
  let event_name = data.event_name;

  const content: { component: any } = {
    component: logContentComponents[event_name] || LogSettingUnknown,
  };

  return (
    <Card withBorder className={classes.paper}>
      <Group>
        <Tooltip withArrow label={originator.name}>
          <Avatar src={originator.avatar} size="md" />
        </Tooltip>
        <Text size="md" fw={500}>
          {created.toLocaleString()}
        </Text>
        <content.component data={data} />
      </Group>
    </Card>
  );
}

function LogSettingUnknown({ data }: { data: any }) {
  return (
    <Text size="md">
      Missing content component for log type &quot;{data.event_name}&quot;
    </Text>
  );
}

function LogSettingUpdated({ data }: { data: any }) {
  const server = useServer();
  const t = useTranslations("audit_logs");

  const setting: string = data.setting;
  const prevValue: any = data.prev_value;
  const value: any = data.value;

  const translationValues = {
    content: (chunks: any) => <Code>{chunks}</Code>,
  };
  let content;

  if (Array.isArray(prevValue) || Array.isArray(value)) {
    let added = (value || []).filter((v: any) => !(prevValue || []).includes(v));
    let removed = (prevValue || []).filter((v: any) => !(value || []).includes(v));

    let append = "both";
    if (added.length > 0 && removed.length == 0) {
      append = "added";
    } else if (added.length == 0 && removed.length > 0) {
      append = "removed";
    }

    content = (
      <Text size="md">
        {t.rich(`setting.${setting}.${append}`, {
          ...translationValues,
          added: (chunks: any) => {
            let elements = [];
            let i = 0;
            for (const element of added) {
              i++;
              elements.push(<Code>{element}</Code>);
              if (i < added.length) {
                elements.push(", ");
              }
            }
            return elements;
          },
          removed: (chunks: any) => {
            let elements = [];
            let i = 0;
            for (const element of removed) {
              i++;
              elements.push(<Code>{element}</Code>);
              if (i < removed.length) {
                elements.push(", ");
              }
            }
            return elements;
          },
        })}
      </Text>
    );
  } else if (typeof prevValue == "number" || typeof value == "number") {
    if (setting == "filter_toxicity" || setting == "filter_hatespeech") {
      content = (
        <Text size="md">
          {t.rich(`setting.${setting}`, {
            ...translationValues,
            prevValue: prevValue && `${prevValue.toLocaleString()}%` || "unknown",
            value: value && `${value.toLocaleString()}%` || "unknown",
          })}
        </Text>
      );
    } else {
      content = (
        <Text size="md">
          {t.rich(`setting.${setting}`, {
            ...translationValues,
            prevValue: prevValue && prevValue.toLocaleString() || "unknown",
            value: value && value.toLocaleString() || "unknown",
          })}
        </Text>
      );
    }
  } else if (setting.endsWith("_restrictions")) {
    const filter_types = ["allow", "blacklist"];
    const fields = ["user", "channel", "role"];

    // loop through filter_types
    let restrictionContents = [];
    for (const filter_type of filter_types) {
      // loop through fields
      let fieldContents = [];
      for (const field of fields) {
        const filter = `${filter_type}_${field}s`;

        let oldItems = prevValue && prevValue[filter] || [];
        let newItems = value && value[filter] || [];
        let changes = {
          added: newItems.filter((newItem: any) => !oldItems.includes(newItem)),
          removed: oldItems.filter((oldItem: any) => !newItems.includes(oldItem)),
        }

        let append = "both";
        if (changes.added.length > 0 && changes.removed.length == 0) {
          append = "added";
        } else if (changes.added.length == 0 && changes.removed.length > 0) {
          append = "removed";
        }

        if (changes.added.length > 0 || changes.removed.length > 0) {
          // loop through changes and replace members, roles, and channels with their names
          for (const change of ["added", "removed"]) {
            const key = change as keyof typeof changes;
            for (const [i, item] of changes[key].entries()) {
              if (field == "user") {
                changes[key][i] = "@" + (server.serverData?.members[item]?.name || item);
              } else if (field == "channel") {
                changes[key][i] = "#" + (server.serverData?.channels[item]?.name || item);
              } else if (field == "role") {
                changes[key][i] = "@" + (server.serverData?.roles[Number.parseInt(item)]?.name || item);
              }
            }
          }

          fieldContents.push(
            <Text key={`${setting}.${filter_type}.${field}.${append}`} size="md">
              {t.rich(`setting.${setting}.${filter_type}.${field}.${append}`, {
                ...translationValues,
                assigned: (chunks: any) => {
                  let elements = [];
                  let i = 0;
                  for (const element of changes.added) {
                    i++;
                    elements.push(<Code>{element}</Code>);
                    if (i < changes.added.length) {
                      elements.push(", ");
                    }
                  }
                  return elements;
                },
                unassigned: (chunks: any) => {
                  let elements = [];
                  let i = 0;
                  for (const element of changes.removed) {
                    i++;
                    elements.push(<Code>{element}</Code>);
                    if (i < changes.removed.length) {
                      elements.push(", ");
                    }
                  }
                  return elements;
                }
              }
            )}
            </Text>
          );
        }
      }
      if (fieldContents.length > 0) {
        restrictionContents.push(...fieldContents);
      }
    }
    content = (
      <Stack gap={5}>
        {restrictionContents}
      </Stack>
    );
  } else if (setting == "xp_roles") {
    let roles: any = {
      changed: {},
      disabled: []
    };

    const oldRoles: any = prevValue || {};

    for (const [roleId, xp] of Object.entries(value || {})) {
      if (xp == 0) {
        roles.disabled.push(roleId);
      } else if (oldRoles[roleId] != xp) {
        roles.changed[roleId] = xp as Number;
      }
    }

    let changes = [];

    for (const [roleId, xp] of Object.entries(roles.changed)) {
      changes.push(
        <Text key={roleId} size="md">
          {t.rich(`setting.${setting}.changed`, {
            ...translationValues,
            role: server?.serverData?.roles[Number.parseInt(roleId)]?.name || `<@&${roleId}>`,
            value: (xp as Number).toLocaleString(),
            prevValue: oldRoles[roleId] && (oldRoles[roleId] as Number).toLocaleString() || "unknown",
          })}
        </Text>
      );
    }
    for (const roleId of roles.disabled) {
      changes.push(
        <Text key={roleId} size="md">
          {t.rich(`setting.${setting}.disabled`, {
            ...translationValues,
            role: server?.serverData?.roles[Number.parseInt(roleId)]?.name || `<@&${roleId}>`,
          })}
        </Text>
      );
    }

    content = (
      <Stack gap={5}>
        {changes}
      </Stack>
    )
  } else if (setting == "permissions") {
    let roles: { [id: string]: {
      assigned: string[];
      unassigned: string[];
    } } = {};

    for (const [roleId, perms] of Object.entries(value || {})) {
      if (!roles[roleId]) {
        roles[roleId] = {
          assigned: [],
          unassigned: [],
        }
      }
      let role = roles[roleId];

      const prevRole = (prevValue || {})[roleId] || [];
      for (const perm of perms as string[]) {
        if (!prevRole.includes(perm)) {
          role.assigned.push(perm);
        }
      }
    }
    for (const [roleId, perms] of Object.entries(prevValue || {})) {
      if (!roles[roleId]) {
        roles[roleId] = {
          assigned: [],
          unassigned: [],
        }
      }
      let role = roles[roleId];

      for (const perm of perms as string[]) {
        if (!value || !value[roleId] || !value[roleId].includes(perm)) {
          role.unassigned.push(perm);
        }
      }
    }

    let roleContents = [];
    for (const [roleId, role] of Object.entries(roles)) {
      let append = "both";
      if (role.assigned.length > 0 && role.unassigned.length == 0) {
        append = "added";
      } else if (role.assigned.length == 0 && role.unassigned.length > 0) {
        append = "removed";
      } else if (role.assigned.length == 0 && role.unassigned.length == 0) {
        append = "cleared";
      }
      roleContents.push(
        <Text key={roleId} size="md">
          {t.rich(`setting.${setting}.${append}`, {
            ...translationValues,
            role: server?.serverData?.roles[Number.parseInt(roleId)]?.name,
            assigned: (chunks: any) => {
              let elements = [];
              let i = 0;
              for (const element of role.assigned) {
                i++;
                elements.push(<Code key={i}>{element}</Code>);
                if (i < role.assigned.length) {
                  elements.push(", ");
                }
              }
              return elements;
            },
            unassigned: (chunks: any) => {
              let elements = [];
              let i = 0;
              for (const element of role.unassigned) {
                i++;
                elements.push(<Code key={i}>{element}</Code>);
                if (i < role.unassigned.length) {
                  elements.push(", ");
                }
              }
              return elements;
            },
          })}
        </Text>
      )
    }
    content = (
      <Stack>
        {roleContents}
      </Stack>
    )
  } else {
    content = (
      <Text size="md">
        {t.rich(`setting.${setting}`, {
          ...translationValues,
          prevValue: prevValue?.toString() || "unknown",
          value: value?.toString() || "unknown",
        })}
      </Text>
    );
  }

  return content;
}
