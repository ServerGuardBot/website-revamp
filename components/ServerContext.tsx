"use client";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { SessionGuild, useSession } from "@/app/api/client";
import { usePathname } from "next/navigation";

export interface GuildedChannel {
    id: string;
    name: string;
    type: "chat" | "voice" | "stream" | "list" | "announcement" | "media" | "doc" | "event" | "scheduling" | "forum";
}

export interface GuildedRole {
    base: boolean;
    color: string[];
    name: string;
    perms: string[];
    priority: number;
}

export interface ServerData {
    channels: GuildedChannel[];
    roles: {[id: number]: GuildedRole};
    prefix: string;
}

export interface ServerContext {
    status: "loading" | "success" | "error";
    error?: "not-found" | "unknown";

    sessionGuild?: SessionGuild;
    serverData?: ServerData;
}

const context = createContext<ServerContext>({
    status: "loading",
});

export function useServer() {
    return useContext(context);
}

export function ServerProvider(props: PropsWithChildren<{}>) {
    const [state, setState] = useState<ServerContext>({
        status: "loading",
    });
    const session = useSession();
    const pathname = usePathname();

    useEffect(() => {
        if (session.status == "loading") return;
        const activeServer = pathname?.split("/servers/")[1]?.split("/")[0];
        if (activeServer) {
            const guild = session.guilds.find(g => g.id === activeServer);
            if (guild) {
                const req = new ServerGuardRequest(`/servers/${activeServer}`, "GET");
                req.execute().then(data => {
                    setState({
                        status: "success",
                        sessionGuild: guild,
                        serverData: data,
                    });
                }).catch(() => {
                    setState({
                        status: "error",
                        error: "unknown",
                        sessionGuild: guild,
                    });
                })
            } else {
                setState({
                    status: "error",
                    error: "not-found",
                });
            }
        }
    }, [pathname, session])

    return <context.Provider value={state} {...props} />;
}