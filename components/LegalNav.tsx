"use client";
import { useState } from "react";
import { IconClipboard, IconFingerprint } from "@tabler/icons-react";
import classes from "./LegalNav.module.css";
import Link from "next/link";
import { Title } from "@mantine/core";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import trimLocale from "@/helpers/trimLocale";

export default function LegalNav() {
  const t = useTranslations("general");
  const [active, setActive] = useState(trimLocale(usePathname()));

  const data = [
    { icon: IconClipboard, label: t("terms"), link: "/legal/tos" },
    { icon: IconFingerprint, label: t("privacy"), link: "/legal/privacy" },
  ];

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.link === active || undefined}
      href={item.link}
      key={item.label}
      onClick={() => {
        setActive(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Title ta="center" className={classes.header}>
          Legal
        </Title>
        {links}
      </div>
    </nav>
  );
}
