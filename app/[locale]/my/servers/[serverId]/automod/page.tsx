"use client";
import {
  ActionIcon,
  Avatar,
  Group,
  Input,
  Modal,
  MultiSelect,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Slider,
  Space,
  Stack,
  Switch,
  TagsInput,
  Text,
  Title,
  Tooltip,
  rem,
} from "@mantine/core";
import {
  FilterRestrictions,
  ServerData,
  useServer,
} from "@/components/ServerContext";
import { IconSettings, IconStar } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useTranslations } from "next-intl";

import classes from "../page.module.css";

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("automod");
  const tg = useTranslations("general");
  const tl = useTranslations("locales");
  return (
    <ScrollArea.Autosize h="100%">
      <div className={classes.main}>
        <Stack gap="xs" w="100%">
          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{tg("settings")}</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    {t("malicious_urls.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="malicious_urls" />
                  </Input.Label>
                  <Input.Description>
                    {t("malicious_urls.description")}
                  </Input.Description>
                  <Switch
                    checked={server.serverData?.malicious_urls || false}
                    onChange={(e) => {
                      server.updateConfig(
                        "malicious_urls",
                        e.currentTarget.checked
                      );
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    {t("invite_links.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="filter_invites" />
                  </Input.Label>
                  <Input.Description>
                    {t("invite_links.description")}
                  </Input.Description>
                  <Switch
                    checked={server.serverData?.filter_invites || false}
                    onChange={(e) => {
                      server.updateConfig(
                        "filter_invites",
                        e.currentTarget.checked
                      );
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    {t("api_keys.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="filter_api_keys" />
                  </Input.Label>
                  <Input.Description>
                    {t("api_keys.description")}
                  </Input.Description>
                  <Switch
                    checked={server.serverData?.filter_api_keys || false}
                    onChange={(e) => {
                      server.updateConfig(
                        "filter_api_keys",
                        e.currentTarget.checked
                      );
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
                <Input.Wrapper>
                  <Input.Label className={classes.centerVertical}>
                    {t("mass_mentions.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="filter_mass_mentions" />
                  </Input.Label>
                  <Input.Description>
                    {t("mass_mentions.description")}
                  </Input.Description>
                  <Switch
                    checked={server.serverData?.filter_mass_mentions || false}
                    onChange={(e) => {
                      server.updateConfig(
                        "filter_mass_mentions",
                        e.currentTarget.checked
                      );
                    }}
                    mt="xs"
                  />
                </Input.Wrapper>
              </SimpleGrid>
              <Select
                label={t("logs.label")}
                description={t("logs.description")}
                value={server.serverData?.logs_automod || "0"}
                data={server?.textChannels}
                onChange={(value) => {
                  server.updateConfig("logs_automod", value);
                }}
              />
              <Input.Wrapper>
                <Input.Label className={classes.centerVertical}>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <Tooltip label={tg("premium_feature")}>
                      <IconStar
                        color="var(--mantine-color-yellow-3)"
                        size="1.1rem"
                        stroke=".15rem"
                      />
                    </Tooltip>
                    <Space w={4} />
                    {t("nsfw.label")}
                  </div>
                  <Space className={classes.grow} />
                  <FilterConfig
                    setting="filter_nsfw"
                    disabled={!server.sessionGuild?.isPremium}
                  />
                </Input.Label>
                <Input.Description>{t("nsfw.description")}</Input.Description>
                <Slider
                  disabled={!server.sessionGuild?.isPremium}
                  value={server.serverData?.filter_nsfw}
                  onChange={(value) => {
                    server.updateConfig("filter_nsfw", value);
                  }}
                />
              </Input.Wrapper>
              <Input.Wrapper>
                <Input.Label className={classes.centerVertical}>
                  {t("spam.label")}
                  <Space className={classes.grow} />
                  <FilterConfig setting="spam_filter" />
                </Input.Label>
                <Input.Description>{t("spam.description")}</Input.Description>
                <Slider
                  value={server.serverData?.spam_filter}
                  onChange={(value) => {
                    server.updateConfig("spam_filter", value);
                  }}
                />
              </Input.Wrapper>
              <Input.Wrapper>
                <Input.Label className={classes.centerVertical}>
                  {t("toxicity.label")}
                  <Space className={classes.grow} />
                  <FilterConfig setting="filter_toxicity" />
                </Input.Label>
                <Input.Description>
                  {t("toxicity.description")}
                </Input.Description>
                <Slider
                  value={server.serverData?.filter_toxicity}
                  onChange={(value) => {
                    server.updateConfig("filter_toxicity", value);
                  }}
                  label={(value) => {
                    if (!value) return "DISABLED";
                    return `${value}%`;
                  }}
                  precision={0}
                />
              </Input.Wrapper>
              <Input.Wrapper>
                <Input.Label className={classes.centerVertical}>
                  {t("hate-speech.label")}
                  <Space className={classes.grow} />
                  <FilterConfig setting="filter_hatespeech" />
                </Input.Label>
                <Input.Description>
                  {t("hate-speech.description")}
                </Input.Description>
                <Slider
                  value={server.serverData?.filter_hatespeech}
                  onChange={(value) => {
                    server.updateConfig("filter_hatespeech", value);
                  }}
                  label={(value) => {
                    if (!value) return "DISABLED";
                    return `${value}%`;
                  }}
                  precision={0}
                />
              </Input.Wrapper>
              <MultiSelect
                data={
                  server.limits?.supportedFilterLangs.map((item) => {
                    return {
                      value: item,
                      label: tl(item),
                    };
                  }) || undefined
                }
                label={
                  <div className={classes.centerVertical}>
                    {t("default_profanities.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="default_profanities" />
                  </div>
                }
                className={classes.fullWidthLabel}
                placeholder={t("default_profanities.placeholder")}
                description={t("default_profanities.description")}
                searchable
                value={server.serverData?.default_profanities || []}
                onChange={(value) => {
                  server.updateConfig("default_profanities", value);
                }}
              />
              <TagsInput
                label={
                  <div className={classes.centerVertical}>
                    {t("blacklist.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="word_blacklist" />
                  </div>
                }
                className={classes.fullWidthLabel}
                description={t("blacklist.description")}
                value={server.serverData?.word_blacklist || []}
                onChange={(value) => {
                  server.updateConfig("word_blacklist", value);
                }}
              />
              <MultiSelect
                data={[
                  // "image", "audio", "video", "application", "font"
                  {
                    label: "Image",
                    value: "image",
                  },
                  {
                    label: "Audio",
                    value: "audio",
                  },
                  {
                    label: "Video",
                    value: "video",
                  },
                  {
                    label: "Application",
                    value: "application",
                  },
                  {
                    label: "Font",
                    value: "font",
                  },
                ]}
                label={
                  <div className={classes.centerVertical}>
                    {t("untrusted_block_attachments.label")}
                    <Space className={classes.grow} />
                    <FilterConfig setting="untrusted_block_attachments" />
                  </div>
                }
                className={classes.fullWidthLabel}
                placeholder={t("untrusted_block_attachments.placeholder")}
                description={t("untrusted_block_attachments.description")}
                searchable
                value={server.serverData?.untrusted_block_attachments || []}
                onChange={(value) => {
                  server.updateConfig("untrusted_block_attachments", value);
                }}
              />
            </Stack>
          </Paper>
        </Stack>
      </div>
    </ScrollArea.Autosize>
  );
}

function FilterConfig({
  setting,
  disabled,
}: {
  setting: string;
  disabled?: boolean;
}) {
  const t = useTranslations("automod");
  const ts = useTranslations("settings");
  const server = useServer();

  const [opened, { open, close }] = useDisclosure(false);

  let restrictions: FilterRestrictions = {
    allow_users: [],
    allow_channels: [],
    allow_roles: [],
    blacklist_users: [],
    blacklist_channels: [],
    blacklist_roles: [],
  };
  if (
    server?.serverData &&
    server?.serverData[`${setting}_restrictions` as keyof ServerData]
  ) {
    restrictions = {
      ...restrictions,
      ...(server?.serverData[
        `${setting}_restrictions` as keyof ServerData
      ] as any),
    };
  }

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={`${ts(setting)} Restrictions`}
        size="auto"
      >
        <Group gap={12}>
          <Stack gap={3}>
            <MultiSelect
              data={server?.mappedMembers}
              label={t("restrictions.allow_users.label")}
              placeholder={t("restrictions.allow_users.placeholder")}
              searchable
              renderOption={({ option }) => {
                return (
                  <Group gap="sm">
                    <Avatar
                      src={server.serverData?.members[option.value]?.avatar!}
                      size="sm"
                    />
                    <Text size="sm">{option.label}</Text>
                  </Group>
                );
              }}
              value={restrictions.allow_users}
              onChange={(value) =>
                server.updateConfig(`${setting}_restrictions`, {
                  ...restrictions,
                  allow_users: value,
                })
              }
            />
            <MultiSelect
              data={server?.mappedRoles}
              label={t("restrictions.allow_roles.label")}
              placeholder={t("restrictions.allow_roles.placeholder")}
              searchable
              renderOption={({ option }) => {
                const role =
                  server.serverData?.roles[Number.parseInt(option.value)];
                if (!role) return undefined;
                return (
                  <Text
                    size="sm"
                    variant={(role.color.length > 1 && "gradient") || undefined}
                    c={(role.color.length == 1 && role.color[0]) || undefined}
                    gradient={
                      (role.color.length > 1 && {
                        from: role.color[0],
                        to: role.color[1],
                        deg: 90,
                      }) ||
                      undefined
                    }
                  >
                    {option.label}
                  </Text>
                );
              }}
              value={restrictions.allow_roles}
              onChange={(value) =>
                server.updateConfig(`${setting}_restrictions`, {
                  ...restrictions,
                  allow_roles: value,
                })
              }
            />
            <MultiSelect
              data={server?.textChannels}
              label={t("restrictions.allow_channels.label")}
              placeholder={t("restrictions.allow_channels.placeholder")}
              searchable
              value={restrictions.allow_channels}
              onChange={(value) =>
                server.updateConfig(`${setting}_restrictions`, {
                  ...restrictions,
                  allow_channels: value,
                })
              }
            />
          </Stack>
          <Stack gap={3}>
            <MultiSelect
              data={server?.mappedMembers}
              label={t("restrictions.blacklist_users.label")}
              placeholder={t("restrictions.blacklist_users.placeholder")}
              searchable
              renderOption={({ option }) => {
                return (
                  <Group gap="sm">
                    <Avatar
                      src={server.serverData?.members[option.value]?.avatar!}
                      size="sm"
                    />
                    <Text size="sm">{option.label}</Text>
                  </Group>
                );
              }}
              value={restrictions.blacklist_users}
              onChange={(value) =>
                server.updateConfig(`${setting}_restrictions`, {
                  ...restrictions,
                  blacklist_users: value,
                })
              }
            />
            <MultiSelect
              data={server?.mappedRoles}
              label={t("restrictions.blacklist_roles.label")}
              placeholder={t("restrictions.blacklist_roles.placeholder")}
              searchable
              renderOption={({ option }) => {
                const role =
                  server.serverData?.roles[Number.parseInt(option.value)];
                if (!role) return undefined;
                return (
                  <Text
                    size="sm"
                    variant={(role.color.length > 1 && "gradient") || undefined}
                    c={(role.color.length == 1 && role.color[0]) || undefined}
                    gradient={
                      (role.color.length > 1 && {
                        from: role.color[0],
                        to: role.color[1],
                        deg: 90,
                      }) ||
                      undefined
                    }
                  >
                    {option.label}
                  </Text>
                );
              }}
              value={restrictions.blacklist_roles}
              onChange={(value) =>
                server.updateConfig(`${setting}_restrictions`, {
                  ...restrictions,
                  blacklist_roles: value,
                })
              }
            />
            <MultiSelect
              data={server?.textChannels}
              label={t("restrictions.blacklist_channels.label")}
              placeholder={t("restrictions.blacklist_channels.placeholder")}
              searchable
              value={restrictions.blacklist_channels}
              onChange={(value) =>
                server.updateConfig(`${setting}_restrictions`, {
                  ...restrictions,
                  blacklist_channels: value,
                })
              }
            />
          </Stack>
        </Group>
      </Modal>
      <ActionIcon
        color="gray"
        variant="subtle"
        disabled={disabled}
        onClick={open}
      >
        <IconSettings stroke={rem(1.3)} color="var(--mantine-color-dark-3)" />
      </ActionIcon>
    </>
  );
}
