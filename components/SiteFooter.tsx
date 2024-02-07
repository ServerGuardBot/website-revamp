"use client";
import { Container, Group, Anchor, Text, Stack } from '@mantine/core';
import classes from './SiteFooter.module.css';
import Logo from '@/components/Logo';
import { useTranslations } from 'next-intl';

export default function SiteFooter() {
  const t = useTranslations("general");

  const links = [
    { link: 'https://www.guilded.gg/server-guard', label: t("support") },
    { link: '/legal', label: t("terms") },
    { link: 'https://www.guilded.gg/server-guard/groups/D57rgP7z/channels/7ad31d28-0577-4f18-a80d-d401ceacf9db/docs', label: t("documentation") },
    { link: '/premium', label: t("premium") },
    { link: 'https://github.com/ServerGuardBot', label: t("github") },
  ];
  
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group>
            <Logo size={28} />
            <Stack gap={.35}>
                <Text size="sm" c="dimmed">{t("endorse-notice")}</Text>
                <Text size="sm" c="dimmed">{t.rich("copyright")}</Text>
            </Stack>
        </Group>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}