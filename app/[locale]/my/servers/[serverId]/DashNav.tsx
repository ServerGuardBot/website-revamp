"use client";
import DashNavigation, { DashLink } from "@/components/DashNavigation";
import { ServerContext, useServer } from "@/components/ServerContext";
import {
  IconBell,
  IconChecklist,
  IconDashboard,
  IconGift,
  IconMessage2Exclamation,
  IconRss,
  IconShieldCheck,
  IconTrendingUp,
  IconUser,
  IconUserShield,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useTranslations } from "next-intl";

const moduleMap = {
  "verification": "verification",
  "logging": "logging",
  "xp": "xp",
  "automod": "automod",
  "welcomer": "welcomer",
  "moderation": "moderation",
  "autoroles": "autoroles",
  "feeds": "feeds",
  "giveaways": "giveaways",
}

export const dashLinks: DashLink[] = [
  {
    name: "Dashboard",
    href: "",
    icon: IconDashboard,
  },
  {
    name: "Permissions",
    href: "permissions",
    icon: IconUsersGroup,
  },
  {
    name: "Audit Log",
    href: "audit",
    icon: IconUserShield,
  },
  {
    name: "Moderation",
    children: [
      {
        name: "Verification",
        href: "verification",
        icon: IconShieldCheck,
      },
      {
        name: "Logging",
        href: "logging",
        icon: IconChecklist,
      },
      {
        name: "XP Management",
        href: "xp",
        icon: IconTrendingUp,
      },
      {
        name: "Automod",
        href: "automod",
        icon: IconMessage2Exclamation,
      },
      {
        name: "Autoroles",
        href: "autoroles",
        icon: IconUser,
      },
    ],
  },
  {
    name: "General",
    children: [
      {
        name: "Welcomer",
        href: "welcomer",
        icon: IconBell,
      },
      {
        name: "RSS Feeds",
        href: "feeds",
        icon: IconRss,
      },
      {
        name: "Giveaways",
        href: "giveaways",
        icon: IconGift,
      },
    ],
  },
];

export function slugify(str: string) {
  if (str.trim() == "") {
    return "index";
  }
  return str.toLowerCase().replace(/[\s\/]+/g, "_")
    .replace(/\//g, "_");
}

function parseDashLinks(t: any, server: ServerContext, links: DashLink[]): DashLink[] {
  return links.map((link) => {
    let disabled = false;
    if (typeof link?.href !== "undefined" && Object.hasOwn(moduleMap, link.href)) {
      const key = link.href as keyof typeof moduleMap;
      disabled = !server.serverData?.modules?.includes(moduleMap[key]);
    }
    if (link.children) {
      return {
        ...link,
        name: t(`category.${slugify(link.name as string)}`),
        disabled,
        children: parseDashLinks(t, server, link.children),
      };
    }
    return {
      ...link,
      name: t(slugify(link.href as string)),
      disabled,
    };
  });
}

export default function DashNav() {
    const t = useTranslations("navigation.dashboard");
    const server = useServer();
    if (server.status == "loading") return <></>;
    return <DashNavigation links={parseDashLinks(t, server, dashLinks)} />;
}