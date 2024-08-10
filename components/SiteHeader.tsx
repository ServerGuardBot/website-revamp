"use client";
import {
  Container,
  Group,
  Burger,
  Drawer,
  Button,
  Loader,
  Avatar,
  Stack,
  Text,
  rem,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconLogin,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import trimLocale from "@/helpers/trimLocale";
import classes from "./SiteHeader.module.css";
import { useSession } from "@/app/api/client";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import SchemeToggle from "./SchemeToggle";
import LangSwitcher from "./LangSwitcher";
import Logo from "@/components/Logo";
import Link from "next/link";
import ServerGuardRequest from "@/app/api/ServerGuardRequest";

function LoginWidget() {
  const t = useTranslations("general");
  const session = useSession();
  if (session.status == "loading") {
    return <Loader variant="dots" />;
  } else {
    return session.status == "unauthenticated" ? (
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
    ) : (
      <Menu withArrow>
        <Menu.Target>
          <Button
            leftSection={<Avatar src={session.user?.avatar} size={28} />}
            size="sm"
            variant="transparent"
            className={classes.logged_in_widget}
            c="var(--mantine-color-text)"
            p={4}
          >
            <Stack gap={0}>
              <Text size={rem(14)} fw={500} truncate="end">
                {session.user?.name}
              </Text>
              <Text size={rem(11)} c="dimmed">
                {session.user?.id}
              </Text>
            </Stack>
          </Button>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<IconUser />}>
            <Link
              style={{ color: "var(--mantine-color-text)" }}
              className={classes.menu_item}
              href="/my/account"
            >
              {t("dashboard")}
            </Link>
          </Menu.Item>
          {session.user?.isDeveloper && (
            <Menu.Item leftSection={<IconDashboard />}>
              <Link
                style={{ color: "var(--mantine-color-text)" }}
                className={classes.menu_item}
                href="/dev"
              >
                {t("internal")}
              </Link>
            </Menu.Item>
          )}
          <Menu.Item
            leftSection={<IconLogout color="var(--mantine-color-red-6)" />}
            onClick={() => {
              const req = new ServerGuardRequest("/logout", "POST");
              req
                .execute()
                .then(() => {
                  session.loadSession();
                  if ("serviceWorker" in navigator) {
                    navigator.serviceWorker
                      .getRegistration()
                      .then((reg) =>
                        reg?.active?.postMessage({ type: "reloadSession" })
                      );
                  }
                })
                .catch(() => {
                  session.loadSession();
                  if ("serviceWorker" in navigator) {
                    navigator.serviceWorker
                      .getRegistration()
                      .then((reg) =>
                        reg?.active?.postMessage({ type: "reloadSession" })
                      );
                  }
                });
            }}
          >
            <Text size="sm" c="red.6">
              Logout
            </Text>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }
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

  items.push(
    <SchemeToggle
      size="calc(var(--mantine-font-size-sm) + 22px)"
      key="scheme-toggle"
    />
  );
  items.push(
    <LangSwitcher
      size="calc(var(--mantine-font-size-sm) + 22px)"
      key="lang-switcher"
    />
  );
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
