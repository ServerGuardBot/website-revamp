"use client";
import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { SessionGuild, useSession } from "@/app/api/client";
import { Button, Dialog, Group, Text } from "@mantine/core";
import { notifications } from '@mantine/notifications';
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { IconAlertTriangle, IconInfoCircle } from "@tabler/icons-react";

export interface GuildedChannel {
  id: string;
  name: string;
  type:
    | "chat"
    | "voice"
    | "stream"
    | "list"
    | "announcement"
    | "media"
    | "doc"
    | "event"
    | "scheduling"
    | "forum";
}

export interface GuildedRole {
  base: boolean;
  color: string[];
  name: string;
  perms: string[];
  priority: number;
  can_manage: boolean;
}

export interface GuildedMember {
  name: string;
  avatar: string;
}

export type GuildedRoleList = { [id: string]: GuildedRole };

export enum WelcomerCycle {
  Daily = "Daily",
  Weekly = "Weekly",
  Monthly = "Monthly",
  Random = "Random",
  PerUser = "PerUser"
}

export interface FilterRestrictions {
  allow_users: string[],
  allow_channels: string[],
  allow_roles: string[],
  blacklist_users: string[],
  blacklist_channels: string[],
  blacklist_roles: string[],
}

export interface ServerData {
  channels: GuildedChannel[];
  roles: { [id: number]: GuildedRole };
  members: { [id: string]: GuildedMember };
  permissions: { [id: number]: string[] };
  modules: string[];

  prefix?: string;
  nickname?: string;
  timezone?: string;
  language?: string;
  muted_role?: string;

  untrusted_block_attachments?: string[];

  default_profanities?: string[];
  default_profanities_restrictions?: FilterRestrictions;

  word_blacklist?: string[];
  word_blacklist_restrictions?: FilterRestrictions;

  malicious_urls?: boolean;
  malicious_urls_restrictions?: FilterRestrictions;

  spam_filter?: number;
  spam_filter_restrictions?: FilterRestrictions;

  filter_mass_mentions?: boolean;
  filter_mass_mentions_restrictions?: FilterRestrictions;

  filter_invites?: boolean;
  filter_invites_restrictions?: FilterRestrictions;

  filter_api_keys?: boolean;
  filter_api_keys_restrictions?: FilterRestrictions;

  filter_toxicity?: number;
  filter_toxicity_restrictions?: FilterRestrictions;

  filter_hatespeech?: number;
  filter_hatespeech_restrictions?: FilterRestrictions;

  filter_nsfw?: number;
  filter_nsfw_restrictions?: FilterRestrictions;

  silence_commands?: boolean;
  log_commands?: boolean;
  log_roles?: boolean;
  logs_traffic?: string;
  logs_message?: string;
  logs_verification?: string;
  logs_action?: string;
  logs_user?: string;
  logs_management?: string;
  logs_nsfw?: string;
  logs_automod?: string;

  admin_contact?: string;
  block_tor?: boolean;
  check_ips?: boolean;
  raid_guard?: boolean;
  verified_role?: string;
  unverified_role?: string;
  verification_channel?: string;

  re_toxicity?: number;
  re_hatespeech?: number;
  re_nsfw?: number;
  re_blacklist?: string[];

  remove_old_level_roles?: boolean;
  announce_level_up?: boolean;
  xp_roles: { [id: string]: number };

  send_welcome?: boolean;
  welcome_message?: string;
  welcome_channel?: string;
  welcome_image?: string[];
  welcome_image_cycle?: WelcomerCycle;

  send_goodbye?: boolean;
  goodbye_message?: string;
  goodbye_channel?: string;
  goodbye_image?: string[];
  goodbye_image_cycle?: WelcomerCycle;

  giveaway_ping_role?: string;
  giveaway_channel?: string;
}

export interface ServerLimits {
  welcomerMessageLength: number;
  blacklistLength: number;
  supportedFilterLangs: string[];
}

export interface ServerContext {
  status: "loading" | "success" | "error";
  error?: "not-found" | "unknown";

  sessionGuild?: SessionGuild;
  serverData?: ServerData;
  limits?: ServerLimits;

  mappedRoles?: {
    value: string;
    label: string;
  }[];
  allMappedRoles?: {
    value: string;
    label: string;
  }[];
  mappedMembers?: {
    value: string;
    label: string;
  }[];
  textChannels?: {
    value: string;
    label: string;
  }[];

  updateConfig: (key: string, value: any) => void;
  saveChanges: (() => Promise<object>) | (() => void);
  clearChanges: () => void;
  failedChanges: { [key: string]: string };
  isDirty: boolean;
}

const context = createContext<ServerContext>({
  status: "loading",
  updateConfig: () => {},
  saveChanges: () => {},
  clearChanges: () => {},
  isDirty: false,
  failedChanges: {},
});

const defaultLimits: ServerLimits = {
  welcomerMessageLength: 200,
  blacklistLength: 50,
  supportedFilterLangs: ["en"],
};

export function useServer() {
  return useContext(context);
}

export function ServerProvider(props: PropsWithChildren<{}>) {
  const t = useTranslations("server_context");
  const tg = useTranslations("general");
  const [state, setState] = useState<ServerContext>({
    status: "loading",
    updateConfig: () => {},
    saveChanges: () => {},
    clearChanges: () => {},
    isDirty: false,
    failedChanges: {},
  });
  const session = useSession();
  const pathname = usePathname();
  const [limits, setLimits] = useState<ServerLimits>(defaultLimits);

  const [changedKeys, setChangedKeys] = useState<{
    [key: string]: any;
  }>({});

  useEffect(() => {
    if (session.status == "loading") return;
    const activeServer = pathname?.split("/servers/")[1]?.split("/")[0];
    if (activeServer) {
      const guild = session.guilds.find((g) => g.id === activeServer);
      if (guild) {
        const reqLimits = new ServerGuardRequest(`/servers/${activeServer}/limits`, "GET");
        reqLimits
          .execute()
          .then((data) => {
            setLimits(data.limits);
          })
          .catch((e) => {
            console.error(e);
            setLimits(defaultLimits);
          })
        const req = new ServerGuardRequest(`/servers/${activeServer}`, "GET");
        req
          .execute()
          .then((data) => {
            let allMappedRoles: { value: string; label: string }[] = [];
            let mappedRoles: { value: string; label: string }[] = [];
            mappedRoles.push({
              value: "0",
              label: tg("disabled"),
            });
            allMappedRoles.push({
              value: "0",
              label: tg("disabled"),
            });
            for (const role in data.server.roles) {
              if (data.server.roles[role].canManage) {
                mappedRoles.push({
                  value: role,
                  label: data.server.roles[role].name as string,
                });
              }
              allMappedRoles.push({
                value: role,
                label: data.server.roles[role].name as string,
              });
            }

            let textChannels: { value: string; label: string }[] = [];
            textChannels.push({
              value: "0",
              label: tg("disabled"),
            });
            for (const channel_id of Object.keys(data.server.channels)) {
              const channel = data.server.channels[channel_id];
              if (channel.type === "chat") {
                textChannels.push({
                  value: channel_id,
                  label: channel.name,
                });
              }
            }

            let mappedMembers: { value: string; label: string }[] = [];
            for (const member_id in data.server.members) {
              mappedMembers.push({
                value: member_id,
                label: data.server.members[member_id].name as string,
              });
            }

            setState(prev => ({
              ...prev,
              status: "success",
              sessionGuild: guild,
              serverData: data.server,
              mappedRoles: mappedRoles,
              allMappedRoles: allMappedRoles,
              mappedMembers: mappedMembers,
              textChannels: textChannels,
            }));
          })
          .catch((e) => {
            console.error(e);
            setState(prev => ({
              ...prev,
              status: "error",
              error: "unknown",
              sessionGuild: guild,
            }));
          });
      } else {
        setState(prev => ({
          ...prev,
          status: "error",
          error: "not-found",
        }));
      }
    }
  }, [pathname, session, tg]);

  const saveSuccess = useCallback((response: any) => {
    if (response.status == "ok") {
      let failedCount = 0;
      for (const key in changedKeys) {
        if (response.failures[key] !== undefined) {
          failedCount++;
        } else {
          if (typeof state.serverData !== "undefined") {
            let _key = key as keyof ServerData;
            setState({
              ...state,
              serverData: {
                ...state.serverData,
                [_key]: changedKeys[key],
              },
            });
          }
        }
      }
      if (failedCount == 0) {
        notifications.show({
          title: t("success.title"),
          message: t("success.message"),
          color: 'green',
          icon: <IconInfoCircle />
        });
        setChangedKeys({});
      } else if (failedCount < Object.keys(response.failures).length) {
        notifications.show({
          title: t("partial.title"),
          message: t("partial.message"),
          color: 'yellow',
          icon: <IconAlertTriangle />
        });
        let newChangedKeys: any = {};
        for (const key in changedKeys) {
          if (response.failures[key] !== undefined) {
            // Keep the change if it failed
            newChangedKeys[key] = changedKeys[key];
          }
        }
        setChangedKeys(newChangedKeys);
        setState({
          ...state,
          failedChanges: response.failures,
        });
      } else {
        notifications.show({
          title: t("failed.title"),
          message: t("failed.message"),
          color: 'red',
          icon: <IconAlertTriangle />
        });
      }
    }
  }, [t, state, changedKeys]);

  const saveFailure = useCallback((e: any) => {
    if (e?.type == "cors") {
      notifications.show({
        title: t("failed.title"),
        message: t("failed.message_cors"),
        color: 'red'
      });
    } else {
      notifications.show({
        title: t("failed.title"),
        message: t("failed.message_server"),
        color: 'red'
      });
    }
  }, [t]);

  const toast = (
    <Dialog
      opened={Object.keys(changedKeys).length > 0}
      size="lg"
      radius="sm"
      transitionProps={{
        transition: "slide-left",
      }}
    >
      <Text size="lg" fw="bold" mb="xs">
        {t("unsaved.title")}
      </Text>
      <Text size="sm" mb="xs">
        {t("unsaved.message")}
      </Text>
      <Group justify="end">
        <Button
          variant="transparent"
          onClick={() => setChangedKeys({})}
          color="var(--mantine-text)"
        >
          {tg("cancel")}
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            const req = new ServerGuardRequest(
              `/servers/${state.sessionGuild?.id}/settings`,
              "PATCH"
            );
            req.execute(changedKeys)
              .then(saveSuccess)
              .catch(saveFailure);
          }}
          color="red"
        >
          {tg("apply")}
        </Button>
      </Group>
    </Dialog>
  );

  const hasChanged = function (old: any, current: any): boolean {
    if (typeof old !== typeof current) return true;
    if (typeof old == "object" && old !== null) {
      if (Array.isArray(old)) {
        // just assume it's an array of strings
        let _current = current as Array<string>;
        for (let i = 0; i < old.length; i++) {
          if (!_current.includes(old[i])) {
            return true;
          }
        }
        for (let i = 0; i < _current.length; i++) {
          if (!old.includes(_current[i])) {
            return true;
          }
        }
      } else {
        for (let key in old) {
          if (!Object.hasOwn(current, key)) return true;
          if (old[key] != current[key]) {
            return true;
          }
        }
        for (let key in current) {
          if (!Object.hasOwn(old, key)) return true;
          if (old[key] != current[key]) {
            return true;
          }
        }
      }
    } else {
      return old !== current;
    }
    return false;
  };

  return (
    <context.Provider
      value={{
        ...state,
        updateConfig: (key, value) => {
          setChangedKeys((prev) => {
            let updated = { ...prev };
            if (state.serverData !== undefined) {
              let _key = key as keyof ServerData;
              let unchanged = state.serverData[_key];
              if (!hasChanged(unchanged, value)) {
                delete updated[key];
              } else {
                updated[key] = value;
              }
            } else {
              updated[key] = value;
            }
            return updated;
          });
          setState(prev => {
            let newFailed = {...prev.failedChanges};
            delete newFailed[key];
            return {
              ...prev,
              failedChanges: newFailed,
            };
          });
        },
        saveChanges: () => {
          const req = new ServerGuardRequest(
            `/servers/${state.sessionGuild?.id}/settings`,
            "PATCH"
          );
          req.execute(changedKeys)
            .then(saveSuccess)
            .catch(saveFailure);
        },
        clearChanges: () => {
          setChangedKeys({});
        },
        isDirty: Object.keys(changedKeys).length > 0,
        serverData: {
          ...state.serverData,
          ...(changedKeys as ServerData),
        },
        limits: limits,
      }}
    >
      {props.children}
      {toast}
    </context.Provider>
  );
}
