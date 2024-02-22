"use client";
import { NotFound } from "@/components/errors/NotFound";
import { useServer } from "@/components/ServerContext";

export default function NotFoundPage() {
    const server = useServer();
    return (
        <NotFound homePage={`/my/servers/${server.sessionGuild?.id || "UNKNOWN"}/`}/>
    )
}