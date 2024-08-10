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
  NumberInput,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { DatePickerInput } from "@mantine/dates";

import {
  IconAlertTriangle,
  IconCircle,
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
  const t = useTranslations("giveaways");
  const tg = useTranslations("general");
  const tsc = useTranslations("server_context");

  const [giveaways, setGiveaways] = useState<any>([]);
  const [totalPages, setTotalPages] = useState<Number>(1);
  const [currentPage, setCurrentPage] = useState<Number>(1);
  const [presets, setPresets] = useState<any>([]);
  const [modalState, setModalState] = useState<any>({
    sendingRequest: false,
    open: false,
    state: "",
    giveaway: "",
    fields: {
      prize: "",
      winners: 1,
      ends_at: null,
      channel: "",
    },
  });

  useEffect(() => {
    const req = new ServerGuardRequest(`/servers/${serverId}/giveaways/list/${currentPage}`, "GET");
    req.execute().then((data: any) => {
      if (data.status === "success") {
        setGiveaways(data.giveaways);
        setTotalPages(data.total_pages);
      }
    });
  }, [serverId, currentPage]);

  return (
    <>
      <Modal
        opened={modalState.open}
        onClose={() => setModalState({ ...modalState, fields: {
            prize: "",
            winners: 1,
            ends_at: null,
            channel: "",
        }, open: false })}
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
                  const req = new ServerGuardRequest(`/servers/${serverId}/giveaways/${modalState.giveaway}`, "DELETE");
                  setModalState({ ...modalState, sendingRequest: true });
                  req.execute().then((data: any) => {
                    setModalState({ ...modalState, sendingRequest: false, open: false });
                    if (data.status === "success") {
                      let new_giveaways = [...giveaways];
                      new_giveaways = new_giveaways.filter((v) => v.id !== modalState.giveaway);
                      setModalState({ ...modalState, open: false, fields: {
                        prize: "",
                        winners: 1,
                        ends_at: null,
                        channel: "",
                      } });
                      setGiveaways(new_giveaways);
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
            <Stack gap="sm">
                <TextInput
                    key="prize"
                    label={t("prize.label")}
                    description={t("prize.description")}
                    value={modalState.fields.prize}
                    onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, prize: e.target.value || "" } });
                    }}
                />
                <NumberInput
                    key="winners"
                    label={t("winners.label")}
                    description={t("winners.description")}
                    value={modalState.fields.winners}
                    onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, winners: e || 1 } });
                    }}
                    min={1}
                    max={20}
                />
                <DatePickerInput
                    key="ends_at"
                    label={t("ends_at.label")}
                    description={t("ends_at.description")}
                    value={modalState.fields.ends_at || undefined}
                    onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, ends_at: e || null } });
                    }}
                    minDate={new Date()}
                />
            </Stack>
            <Space h="sm" />
            <Center>
              <Button
                disabled={
                    modalState.fields.ends_at == null
                }
                onClick={() => {
                    const req = new ServerGuardRequest(`/servers/${serverId}/giveaways/${modalState.giveaway}`, "PATCH");
                    setModalState({ ...modalState, sendingRequest: true });
                    req.execute({
                    ...modalState.fields,
                    }).then((data: any) => {
                    setModalState({ ...modalState, sendingRequest: false, open: false });
                    if (data.status === "success") {
                        let new_giveaways = [...giveaways];
                        new_giveaways = new_giveaways.filter((v) => v.id !== modalState.feed);
                        new_giveaways.push(data.giveaway);
                        setModalState({ ...modalState, open: false, fields: {
                            prize: "",
                            winners: 1,
                            ends_at: null,
                            channel: "",
                        }});
                        setGiveaways(new_giveaways);
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
                }
              }>
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
            <Stack gap="sm">
                {
                    !server.serverData?.giveaway_channel && (
                        <Select
                            key="channel"
                            label={tg("channel")}
                            description={t("channel_description")}
                            data={server.textChannels?.filter((v) => v.value != "0")}
                            value={modalState.fields.channel == "" ? undefined : modalState.fields.channel}
                            onChange={(e) => {
                                setModalState({ ...modalState, fields: { ...modalState.fields, channel: e || "" } });
                            }}
                        />
                    )
                }
                <TextInput
                    key="prize"
                    label={t("prize.label")}
                    description={t("prize.description")}
                    value={modalState.fields.prize}
                    onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, prize: e.target.value || "" } });
                    }}
                />
                <NumberInput
                    key="winners"
                    label={t("winners.label")}
                    description={t("winners.description")}
                    value={modalState.fields.winners}
                    onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, winners: e || 1 } });
                    }}
                    min={1}
                    max={20}
                />
                <DatePickerInput
                    key="ends_at"
                    label={t("ends_at.label")}
                    description={t("ends_at.description")}
                    value={modalState.fields.ends_at || undefined}
                    onChange={(e) => {
                        setModalState({ ...modalState, fields: { ...modalState.fields, ends_at: e || null } });
                    }}
                    minDate={new Date()}
                />
            </Stack>
            <Space h="sm" />
            <Center>
              <Button
                disabled={
                    modalState.fields.ends_at == null
                }
                onClick={() => {
                    const req = new ServerGuardRequest(`/servers/${serverId}/giveaways`, "POST");
                    setModalState({ ...modalState, sendingRequest: true });
                    req.execute({
                    prize: modalState.fields.prize,
                    winners: modalState.fields.winners,
                    ends_at: modalState.fields.ends_at.getTime() / 1000,
                    channel_id: modalState.fields.channel,
                    }).then((data: any) => {
                    setModalState({ ...modalState, sendingRequest: false, open: false });
                    if (data.status === "success") {
                        setModalState({ ...modalState, open: false, fields: {
                            prize: "",
                            winners: 1,
                            ends_at: null,
                            channel: "",
                        }});
                        setGiveaways([...giveaways, data.giveaway]);
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
                }
              }>
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
                giveaways.map((giveaway: any) => {
                  let state = giveaway.state.charAt(0).toUpperCase() + giveaway.state.slice(1);
                  return (
                    <Paper key={giveaway.id} px="xs" py="xs" withBorder className={classes.paper}>
                      <Group justify="space-between" align="start">
                        <Stack gap={0}>
                          <div>
                            <Code>{state}</Code>
                          </div>
                          <Space h={4} />
                          <Text size="md" fw="bold">{giveaway.prize}</Text>
                          <Group gap="xs">
                            <Text size="sm" fs="oblique">{t("winners.count", {
                                "winners": giveaway.winners
                            })}</Text>
                            <IconCircle size={1.1} />
                            <Text size="sm" fs="oblique">{t("entrants", {
                                "entrants": giveaway.entrantrs
                            })}</Text>
                          </Group>
                        </Stack>
                        <Group justify="end" gap="xs">
                          {
                            giveaway.data?.state == "DEAD" && (
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
                              feed: giveaway.id,
                              fields: {
                                preset: giveaway.preset,
                                extra_fields: giveaway.extra_fields,
                                channel: giveaway.channel,
                                webhook: giveaway.webhook,
                                ping_role: giveaway.ping_role,
                              },
                              source: giveaway.webhook && "webhook" || "channel",
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
                              feed: giveaway.id,
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
