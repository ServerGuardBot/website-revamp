"use client";
import { Box, Image, ScrollArea, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import { SessionGuild, useSession } from "@/app/api/client";
import { IconHome } from "@tabler/icons-react";
import Link from "next/link";
import cx from 'clsx';

import classes from "./ServerNavigation.module.css";
import { useServer } from "./ServerContext";
import Logo from "./Logo";
import { useTranslations } from "next-intl";

function ServerNavigationItem({ server, active }: { server: SessionGuild, active: boolean }) {
    return (
        <Tooltip label={server.name} withArrow position="right">
            <UnstyledButton component={Link} href={`/my/servers/${server.id}`} className={cx({
                [classes.server]: true,
                [classes.server_active]: active
            })}>
                <Image src={server.avatar} alt={server.name} className={classes.server_icon} />
            </UnstyledButton>
        </Tooltip>
    )
}

export default function ServerNavigation() {
    const tg = useTranslations("general")
    const session = useSession(true);
    const serverCtx = useServer();

    return (
        <Box h={{ base: "calc(100% - 43px)", md: "100%" }} w={{ base: 82 }} className={classes.navbar}>
            <ScrollArea.Autosize mah="100%" type="never">
                <Stack align="center" gap={10}>
                    <Tooltip label={tg("home")} withArrow position="right">
                        <UnstyledButton component={Link} href="/my/account" className={classes.server}>
                            <Logo size={48} />
                        </UnstyledButton>
                    </Tooltip>
                    {session.guilds.map(server => <ServerNavigationItem key={server.id} server={server} active={server.id === serverCtx?.sessionGuild?.id} />)}
                </Stack>
            </ScrollArea.Autosize>
        </Box>
    )
}