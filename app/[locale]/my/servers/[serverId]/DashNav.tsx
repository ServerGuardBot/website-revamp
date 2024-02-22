"use client";
import DashNavigation, { DashLink } from "@/components/DashNavigation";
import { useServer } from "@/components/ServerContext";
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
  IconUsersGroup,
} from "@tabler/icons-react";

const dashLinks: DashLink[] = [
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

export default function DashNav() {
    const server = useServer();
    if (server.status == "loading") return <></>;
    return <DashNavigation links={dashLinks} />;
}