"use client";
import classes from "./DashHeader.module.css";
import { Burger, Group, Title } from "@mantine/core";
import { dashLinks, slugify } from "@/app/[locale]/my/servers/[serverId]/DashNav";
import { usePathname } from "next/navigation";
import { useServer } from "./ServerContext";
import { useMenu } from "./MenuContext";
import { useTranslations } from "next-intl";

export default function DashHeader() {
  const t = useTranslations("navigation.dashboard");
  let server = useServer();
  let base = "";
  if (server.sessionGuild) {
    base = `/my/servers/${server.sessionGuild.id}/`;
  } else {
    base = "/my/servers/UNKNOWN/";
  }

  const menu = useMenu();
  const menuOpen = menu.menuOpen;
  const toggleMenu = menu.toggleMenu;

  const pathname = usePathname().split(base)[1] || "";
  let title = "Dashboard";
  let icon = dashLinks[0].icon;

  if (pathname) {
    const link = dashLinks.find((link) => link.href === pathname);
    if (link) {
      title = t(slugify(link.href as string));
      icon = link.icon;
    } else {
      title = "Dashboard";
      icon = dashLinks[0].icon;
    }
  }

  const dashIcon = {
    // Stupid hack
    icon: icon,
  };

  return (
    <Group justify="space-between" className={classes.header}>
      <Group gap={6}>
        <Burger opened={menuOpen} onClick={toggleMenu} size="sm" hiddenFrom="sm" />
        <div className={classes.icon}>
          <dashIcon.icon size="1.5rem" stroke={2.2} />
        </div>
        <Title className={classes.title} order={3}>{title}</Title>
      </Group>
      <Group gap={6}></Group>
    </Group>
  );
}
