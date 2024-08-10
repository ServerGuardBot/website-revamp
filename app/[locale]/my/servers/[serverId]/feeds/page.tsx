"use client";
import {
  ScrollArea,
  TextInput,
  ActionIcon,
  Select,
  Button,
  Center,
  Loader,
  Paper,
  Space,
  Stack,
  Title,
  Group,
  Modal,
  Code,
  Text,
  Tooltip,
} from "@mantine/core";
import { modals } from "@mantine/modals";

import {
  IconAlertTriangle,
  IconInfoCircle,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";

import ServerGuardRequest from "@/app/api/ServerGuardRequest";
import { useServer } from "@/components/ServerContext";
import { useTranslations } from "next-intl";

import classes from "../page.module.css";
import { useEffect, useState } from "react";
import { notifications } from "@mantine/notifications";

const WEBHOOK_REGEX = new RegExp("^https?://media\.guilded\.gg/webhooks/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-f0-9]{3}-[a-f0-9]{12}/[a-zA-Z0-9]{86}$");
const UUID_REGEX = new RegExp("[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}");

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("feeds");
  const tg = useTranslations("general");
  const tsc = useTranslations("server_context");

  const [rssFeeds, setRssFeeds] = useState<any>([]);
  const [presets, setPresets] = useState<any>([]);
  const [modalState, setModalState] = useState<any>({
    sendingRequest: false,
    open: false,
    state: "",
    feed: "",
    fields: {
      preset: "",
      extra_fields: {},
      channel: "",
      webhook: "",
      ping_role: "",
    },
    source: "channel",
  });

  useEffect(() => {
    const req = new ServerGuardRequest(`/servers/${serverId}/rss`, "GET");
    req.execute().then((data: any) => {
      if (data.status === "success") {
        setRssFeeds(data.feeds);
        setPresets([
          ...data.presets,
          {
            id: "custom",
            name: "Custom",
            url: "{url}",
            extra_fields: ["url"],
          },
        ]);
      }
    });
  }, [serverId]);

  return (
    <>
      <Modal
        opened={modalState.open}
        onClose={() => setModalState({ ...modalState, fields: { preset: "", extra_fields: {}, channel: "", webhook: "" }, open: false })}
        title={t(modalState.state)}
      >
        {modalState.state == "delete" && (
          <>
            <Text ta="center">{t("delete_confirm")}</Text>
            <Space h="md" />
            <Group justify="center" gap="xl">
              <Button
                variant="transparent"
                color="var(--mantine-color-text)"
              >
                {tg("cancel")}
              </Button>
              <Button
                variant="filled"
                color="red"
                onClick={() => {
                  const req = new ServerGuardRequest(`/servers/${serverId}/rss/${modalState.feed}`, "DELETE");
                  setModalState({ ...modalState, sendingRequest: true });
                  req.execute().then((data: any) => {
                    setModalState({ ...modalState, sendingRequest: false, open: false });
                    if (data.status === "success") {
                      let feeds = [...rssFeeds];
                      feeds = feeds.filter((v) => v.id !== modalState.feed);
                      setModalState({ ...modalState, open: false, fields: { preset: "", extra_fields: {}, channel: "", webhook: "" } });
                      setRssFeeds(feeds);
                      notifications.show({
                        title: tsc("success.title"),
                        message: tsc("success.message"),
                        color: "green",
                        icon: <IconInfoCircle />,
                      });
                    } else {
                      notifications.show({
                        title: tg("error"),
                        message: data.error,
                        color: "red",
                        icon: <IconAlertTriangle />,
                      });
                    }
                  }).catch(() => {
                    setModalState({ ...modalState, sendingRequest: false });
                  });
                }}
              >
                {tg("delete")}
              </Button>
            </Group>
          </>
        ) || modalState.state == "edit" && (
          <>
            <Select
              data={presets.map((preset: any) => {
                return { value: preset.id, label: t(`source_names.${preset.id}`) };
              })} value={modalState.fields.preset} onChange={(e) => {
                setModalState({ ...modalState, fields: { ...modalState.fields, preset: e || "" } });
              }}
              label={t("feed.label")}
              description={t("feed.description")}
            />
            <Space h="sm" />
            {
              modalState.fields.preset && (
                <Stack gap="sm">
                  <Select
                    key="source"
                    label={t("source.label")}
                    description={t("source.description")}
                    data={[
                      { value: "channel", label: tg("channel") },
                      { value: "webhook", label: tg("webhook") },
                    ]}
                    value={modalState.source}
                    onChange={(e) => {
                      setModalState({ ...modalState, source: e || "" });
                    }}
                  />
                  {
                    modalState.source == "channel" && (<Select
                      key="channel"
                      label={tg("channel")}
                      description={t("channel_description")}
                      data={server.textChannels?.filter((v) => v.value != "0")}
                      value={modalState.fields.channel}
                      onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, channel: e || "" } });
                      }}
                    />) || (
                      <TextInput
                        key="webhook"
                        label={tg("webhook")}
                        description={t("webhook_description")}
                        value={modalState.fields.webhook}
                        onChange={(e) => {
                          setModalState({ ...modalState, fields: { ...modalState.fields, webhook: e.target.value || "" } });
                        }}
                        error={
                          modalState.fields.webhook && modalState.fields.webhook.length > 0 && WEBHOOK_REGEX.exec(modalState.fields.webhook) == null && t("invalid_webhook")
                        }
                      />
                    )
                  }
                  {
                    presets.find((preset: any) => preset.id === modalState.fields.preset).extra_fields.map((field: any) => (
                      <TextInput
                        key={field}
                        label={t(`extra_fields.${field}.label`)}
                        description={t(`extra_fields.${field}.description`)}
                        value={modalState.fields.extra_fields[field] || ""}
                        onChange={(e) => {
                          setModalState({ ...modalState, fields: { ...modalState.fields, extra_fields: { ...modalState.fields.extra_fields, [field]: e.target.value || "" } } });
                        }}
                      />
                    ))
                  }
                </Stack>
              )
            }
            <Space h="sm" />
            <Center>
              <Button onClick={() => {
                const req = new ServerGuardRequest(`/servers/${serverId}/rss/${modalState.feed}`, "PATCH");
                setModalState({ ...modalState, sendingRequest: true });
                req.execute({
                  ...modalState.fields,
                }).then((data: any) => {
                  setModalState({ ...modalState, sendingRequest: false, open: false });
                  if (data.status === "success") {
                    let feeds = [...rssFeeds];
                    feeds = feeds.filter((v) => v.id !== modalState.feed);
                    feeds.push(data.feed);
                    setModalState({ ...modalState, open: false, fields: { preset: "", extra_fields: {}, channel: "", webhook: "" } });
                    setRssFeeds(feeds);
                    notifications.show({
                      title: tsc("success.title"),
                      message: tsc("success.message"),
                      color: "green",
                      icon: <IconInfoCircle />,
                    });
                  } else {
                    notifications.show({
                      title: tg("error"),
                      message: data.error,
                      color: "red",
                      icon: <IconAlertTriangle />,
                    });
                  }
                }).catch(() => {
                  setModalState({ ...modalState, sendingRequest: false });
                });
              }}>
                {
                  modalState.sendingRequest && (
                    <Loader size="sm" />
                  ) || tg("confirm")
                }
              </Button>
            </Center>
          </>
        ) || modalState.state == "create" && (
          <>
            <Select
              data={presets.map((preset: any) => {
                return { value: preset.id, label: t(`source_names.${preset.id}`) };
              })} value={modalState.fields.preset} onChange={(e) => {
                setModalState({ ...modalState, fields: { ...modalState.fields, preset: e || "" } });
              }}
              label={t("feed.label")}
              description={t("feed.description")}
            />
            <Space h="sm" />
            {
              modalState.fields.preset && (
                <Stack gap="sm">
                  <Select
                    key="source"
                    label={t("source.label")}
                    description={t("source.description")}
                    data={[
                      { value: "channel", label: tg("channel") },
                      { value: "webhook", label: tg("webhook") },
                    ]}
                    value={modalState.source}
                    onChange={(e) => {
                      setModalState({ ...modalState, source: e || "" });
                    }}
                  />
                  {
                    modalState.source == "channel" && (<Select
                      key="channel"
                      label={tg("channel")}
                      description={t("channel_description")}
                      data={server.textChannels?.filter((v) => v.value != "0")}
                      value={modalState.fields.channel}
                      onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, channel: e || "" } });
                      }}
                    />) || (
                      <TextInput
                        key="webhook"
                        label={tg("webhook")}
                        description={t("webhook_description")}
                        value={modalState.fields.webhook}
                        onChange={(e) => {
                          setModalState({ ...modalState, fields: { ...modalState.fields, webhook: e.target.value || "" } });
                        }}
                        error={
                          modalState.fields.webhook && modalState.fields.webhook.length > 0 && WEBHOOK_REGEX.exec(modalState.fields.webhook) == null && t("invalid_webhook")
                        }
                      />
                    )
                  }
                  {
                    presets.find((preset: any) => preset.id === modalState.fields.preset).extra_fields.map((field: any) => (
                      <TextInput
                        key={field}
                        label={t(`extra_fields.${field}.label`)}
                        description={t(`extra_fields.${field}.description`)}
                        value={modalState.fields.extra_fields[field] || ""}
                        onChange={(e) => {
                          setModalState({ ...modalState, fields: { ...modalState.fields, extra_fields: { ...modalState.fields.extra_fields, [field]: e.target.value || "" } } });
                        }}
                      />
                    ))
                  }
                </Stack>
              )
            }
            <Space h="sm" />
            <Center>
              <Button onClick={() => {
                const req = new ServerGuardRequest(`/servers/${serverId}/rss`, "POST");
                setModalState({ ...modalState, sendingRequest: true });
                req.execute({
                  ...modalState.fields,
                }).then((data: any) => {
                  setModalState({ ...modalState, sendingRequest: false, open: false });
                  if (data.status === "success") {
                    setModalState({ ...modalState, open: false, fields: { preset: "", extra_fields: {}, channel: "", webhook: "" } });
                    setRssFeeds([...rssFeeds, data.feed]);
                    notifications.show({
                      title: tsc("success.title"),
                      message: tsc("success.message"),
                      color: "green",
                      icon: <IconInfoCircle />,
                    });
                  } else {
                    notifications.show({
                      title: tg("error"),
                      message: data.error,
                      color: "red",
                      icon: <IconAlertTriangle />,
                    });
                  }
                }).catch(() => {
                  setModalState({ ...modalState, sendingRequest: false });
                });
              }}>
                {
                  modalState.sendingRequest && (
                    <Loader size="sm" />
                  ) || tg("confirm")
                }
              </Button>
            </Center>
          </>
        )}
      </Modal>
      <ScrollArea.Autosize h="100%">
        <div className={classes.main}>
          <Stack gap="xs" w="100%">
            <Paper px="md" py="xs" withBorder className={classes.paper}>
              <Stack gap="xs">
                <Group justify="space-between">
                  <Title order={1}>{t("title")}</Title>
                  <Button
                    onClick={() => setModalState({ ...modalState, open: true, state: "create" })}
                  >{t("create")}</Button>
                </Group>
              </Stack>
            </Paper>
            <Stack gap="xs">
              {
                rssFeeds.map((feed: any) => {
                  let source = feed.webhook && "Webhook" || "Channel";
                  if (feed.channel) {
                    let channel_name = server.textChannels?.find((v) => v.value == feed.channel)?.label;
                    source = channel_name && `#${channel_name}` || source;
                  } else {
                    let uuid = UUID_REGEX.exec(feed.webhook);
                    if (uuid !== null) {
                      source = `Webhook <${uuid[0]}>`;
                    }
                  }
                  return (
                    <Paper key={feed.id} px="xs" py="xs" withBorder className={classes.paper}>
                      <Group justify="space-between" align="start">
                        <Stack gap={0}>
                          <div>
                            <Code>{source}</Code>
                          </div>
                          <Space h={4} />
                          <Text size="md" fw="bold">{feed.name}</Text>
                          <Text size="xs" c="dimmed" fs="italic">{feed.url}</Text>
                        </Stack>
                        <Group justify="end" gap="xs">
                          {
                            feed.data?.state == "DEAD" && (
                              <Tooltip label={t("feed_dead.tooltip")}>
                                <ActionIcon
                                  size="lg"
                                  variant="subtle"
                                  color="orange"
                                  onClick={() => modals.open({
                                    id: "feed_dead",
                                    title: t("feed_dead.title"),
                                    children: <>
                                      <Text ta="justify">{t("feed_dead.description")}</Text>
                                      <Space h="xs" />
                                      <Group w="100%" justify="center">
                                        <Button onClick={() => modals.closeAll()}>{t("feed_dead.confirm")}</Button>
                                      </Group>
                                    </>,
                                  })}
                                >
                                  <IconAlertTriangle width="80%" height="80%" stroke={1.6} />
                                </ActionIcon>
                              </Tooltip>
                            )
                          }
                          <ActionIcon
                            size="lg"
                            c="var(--mantine-color-text)"
                            variant="subtle"
                            aria-label="Edit"
                            onClick={() => setModalState({
                              ...modalState,
                              open: true,
                              state: "edit",
                              feed: feed.id,
                              fields: {
                                preset: feed.preset,
                                extra_fields: feed.extra_fields,
                                channel: feed.channel,
                                webhook: feed.webhook,
                                ping_role: feed.ping_role,
                              },
                              source: feed.webhook && "webhook" || "channel",
                            })}
                          >
                            <IconPencil width="80%" height="80%" stroke={1.6} />
                          </ActionIcon>
                          <ActionIcon
                            size="lg"
                            c="red"
                            variant="default"
                            aria-label="Delete"
                            onClick={() => setModalState({
                              ...modalState,
                              open: true,
                              state: "delete",
                              feed: feed.id,
                            })}
                          >
                            <IconTrash width="80%" height="80%" stroke={1.6} />
                          </ActionIcon>
                        </Group>
                      </Group>
                    </Paper>
                  );
                })
              }
            </Stack>
          </Stack>
        </div>
      </ScrollArea.Autosize>
    </>
  );
}
