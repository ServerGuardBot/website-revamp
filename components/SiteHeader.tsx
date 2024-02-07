"use client";
import { useEffect, useState } from "react";
import { Container, Group, Burger, Drawer, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconLogin } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import trimLocale from "@/helpers/trimLocale";
import classes from "./SiteHeader.module.css";
import Logo from "@/components/Logo";
import SchemeToggle from "./SchemeToggle";
import LangSwitcher from "./LangSwitcher";
import Link from "next/link";

function LoginWidget() {
  const t = useTranslations("general");
  return (
    <Button
      component="a"
      href="/login"
      leftSection={<IconLogin />}
      size="sm"
      variant="filled"
      className={classes.login_widget}
    >
      {t("login")}
    </Button>
  )
}

export default function SiteHeader() {
  const t = useTranslations("general");
  const pathname = usePathname();
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(trimLocale(pathname));

  const links = [
    {
      link: "https://www.guilded.gg/b/2b2fa670-37c9-453c-8b35-5473fe932e6f",
      label: t("invite"),
    },
    {
      link: "https://www.guilded.gg/server-guard/groups/D57rgP7z/channels/7ad31d28-0577-4f18-a80d-d401ceacf9db/docs",
      label: t("documentation"),
    },
    { link: "/premium", label: t("premium") },
  ];

  const items = links.map((link) => {
    let Component: any = "a";
    if (link.link.startsWith("/")) Component = Link;

    return (
      <Component
        key={link.label}
        href={link.link}
        className={classes.link}
        data-active={active === link.link || undefined}
        onClick={() => {
          setActive(link.link);
        }}
      >
        {link.label}
      </Component>
    );
  });

  useEffect(() => {
    setActive(trimLocale(pathname));
  }, [pathname]);

  items.push(<SchemeToggle size="calc(var(--mantine-font-size-sm) + 22px)" key="scheme-toggle" />);
  items.push(<LangSwitcher size="calc(var(--mantine-font-size-sm) + 22px)" key="lang-switcher" />);
  items.push(<LoginWidget key="login-widget" />);

  return (
    <header className={classes.header}>
      <Drawer
        opened={opened}
        onClose={toggle}
        title={<Logo withText size={28} />}
        padding="xl"
        size="xl"
        transitionProps={{ transition: "slide-left" }}
      >
        {items}
      </Drawer>
      <Container size="md" className={classes.inner}>
        <Logo withLink size={28} />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  );
}
