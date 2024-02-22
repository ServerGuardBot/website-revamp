"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { useRouter } from "next/navigation";

export enum GuildPermission {
  ManageVerification,
  ManageXP,
  ManageModeration,
  ManageAutoMod,
  ManageLogging,
  ManageFilters,
  ManageWelcomer,
  ManageAutoroles,
  ManageFeeds,
  ManageGiveaways,
  ManageAutomations,
  ManageBot,
  CommandsBan,
  CommandsKick,
  CommandsMute,
  CommandsBypass,
  CommandsWarn,
  CommandsEvaluate,
  CommandsUserInfo,
  CommandsServerInfo,
  CommandsPurge,
  CommandsNote,
  BypassFilter,
  HostGiveaways,
  IsTrusted,
}

export interface SessionUser {
  id: string;
  name: string;
  avatar: string;
  language: string;
  isDeveloper: boolean;
}

export interface SessionGuild {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  banner: string;
  members: number;
  perms: GuildPermission[];

  isActive: boolean;
  isPremium: boolean;
}

export interface SessionContext {
  status: "loading" | "unauthenticated" | "authenticated";
  user?: SessionUser;
  guilds: SessionGuild[];

  updateUser: (key: string, value: string) => void;
  saveUser: (() => Promise<object>) | (() => void);
  clearChanges: () => void;
  isUserDirty: boolean;

  loadSession: () => Promise<void>;
}

const context = createContext<SessionContext>({
  status: "loading",
  guilds: [],
  updateUser: () => {},
  saveUser: () => {},
  clearChanges: () => {},
  isUserDirty: false,
  loadSession: () => new Promise<void>((resolve) => resolve),
});

const sessionRequest = new ServerGuardRequest("/session", "GET");
const refreshRequest = new ServerGuardRequest("/refresh", "POST");

export function useSession(required: boolean = false) {
  const router = useRouter();

  const sessionData = useContext(context);

  if (required && sessionData.status === "unauthenticated") {
    router.push("/login");
  }

  return sessionData;
}

export function SessionProvider(props: PropsWithChildren<{}>) {
  const initialized = useRef(false);
  const [changedKeys, setChangedKeys] = useState<{
    [key: string]: string | boolean | number;
  }>({});
  const [user, setUser] = useState<SessionUser | undefined>();
  const [guilds, setGuilds] = useState<SessionGuild[]>([]);
  const [sessionState, setSessionState] = useState<
    "loading" | "unauthenticated" | "authenticated"
  >("loading");

  const loadSession = () => {
    return new Promise<void>((resolve) => {
      setSessionState("loading");
      sessionRequest
        .execute()
        .then((res) => {
          if (res.status == "ok") {
            const parsedGuilds: SessionGuild[] = [];
            for (const guild of res.servers) {
              parsedGuilds.push({
                ...guild,
                perms: guild.perms.map(
                  (perm: string) =>
                    GuildPermission[perm as keyof typeof GuildPermission]
                ),
              });
            }
            setUser(res.user);
            setGuilds(parsedGuilds);
            setSessionState("authenticated");
            resolve();
          } else if (res.error == "Unauthorized") {
            refreshRequest
              .execute()
              .then((res) => {
                if (res.status == "ok") {
                  loadSession().then(() => resolve);
                } else {
                  setSessionState("unauthenticated");
                  resolve();
                }
              })
              .catch(() => {
                setSessionState("unauthenticated");
                resolve();
              });
          } else {
            setSessionState("unauthenticated");
            resolve();
          }
        })
        .catch((res) => {
          if (res.status == 401) {
            refreshRequest
              .execute()
              .then((res) => {
                if (res.status == "ok") {
                  loadSession().then(() => resolve);
                } else {
                  setSessionState("unauthenticated");
                  resolve();
                }
              })
              .catch(() => {
                setSessionState("unauthenticated");
                resolve();
              });
          }
        });
    });
  };
  const updateUser = (key: string, value: string | boolean | number) => {
    setChangedKeys({ ...changedKeys, [key]: value });
  };
  const saveUser = () => {
    return new Promise<object>((resolve, reject) => {
      const req = new ServerGuardRequest("/users/@me/settings", "PATCH");
      req.execute(changedKeys).then((res) => {
        if ((res.status = "ok")) {
          setChangedKeys({});
          resolve(res.settings);
        } else {
          reject(res.error);
        }
      });
    });
  };
  const clearChanges = () => {
    setChangedKeys({});
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alteredUser = {
    ...user,
    ...changedKeys,
  } as SessionUser;

  return (
    <context.Provider
      value={{
        status: sessionState,
        user: alteredUser,
        guilds: guilds,
        updateUser: updateUser,
        saveUser: saveUser,
        clearChanges: clearChanges,
        isUserDirty: Object.keys(changedKeys).length > 0,
        loadSession: loadSession,
      }}
    >
      {props.children}
    </context.Provider>
  );
}
