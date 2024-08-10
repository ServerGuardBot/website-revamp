"use client";
import {
  Input,
  List,
  Paper,
  ScrollArea,
  Select,
  SimpleGrid,
  Space,
  Stack,
  Switch,
  TagsInput,
  Text,
  Title,
} from "@mantine/core";

import CharacterCount from "@tiptap/extension-character-count";
import Placeholder from "@tiptap/extension-placeholder";
import { useServer } from "@/components/ServerContext";
import { RichTextEditor, Link } from "@mantine/tiptap";
import Underline from "@tiptap/extension-underline";
import { HtmlRenderer, Parser } from "commonmark";
import StarterKit from "@tiptap/starter-kit";
import { useTranslations } from "next-intl";
import { BubbleMenu, useEditor } from "@tiptap/react";
import TurndownService from "turndown";

import classes from "../page.module.css";

const TEMPLATES = ["mention", "server_name"];

TurndownService.prototype.escape = (str) => str;
const turndownService = new TurndownService();

const reader = new Parser();
const writer = new HtmlRenderer();

function isValidURL(string: string) {
  var res = string.match(
    /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  );
  return res !== null;
}

export default function Page({
  params: { serverId },
}: {
  params: { serverId: string };
}) {
  const server = useServer();
  const t = useTranslations("welcomer");
  const tg = useTranslations("general");

  const welcome_editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Placeholder.configure({
        placeholder: t("welcome.placeholder"),
      }),
      CharacterCount.configure({
        limit: server.limits?.welcomerMessageLength || 200,
      }),
    ],
    content: writer.render(
        reader.parse(server.serverData?.welcome_message || "Welcome, {mention} to **{server_name}**!")
    )
  });
  const goodbye_editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Placeholder.configure({
        placeholder: t("goodbye.placeholder"),
      }),
      CharacterCount.configure({
        limit: server.limits?.welcomerMessageLength || 200,
      }),
    ],
    content: writer.render(
        reader.parse(server.serverData?.goodbye_message || "Goodbye, {mention}!")
    )
  });

  return (
    <ScrollArea.Autosize h="100%">
      <div className={classes.main}>
        <Stack gap="xs" w="100%">
          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{t("welcome.title")}</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <div className={classes.centerVertical}>
                  <Switch
                    label={tg("enabled")}
                    description={t("welcome.enabled_description")}
                    checked={server.serverData?.send_welcome}
                    onChange={(e) => {
                      server.updateConfig("send_welcome", e.target.checked);
                    }}
                  />
                </div>
                <Select
                  label={tg("channel")}
                  description={t("welcome.channel_description")}
                  value={server.serverData?.welcome_channel || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("welcome_channel", value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TagsInput
                  label={tg("image")}
                  description={t("welcome.image_description")}
                  value={server.serverData?.welcome_image || []}
                  onChange={(value) => {
                    server.updateConfig("welcome_image", value);
                  }}
                  clearable
                />
                <Select
                  label={t("welcomer_cycle.label")}
                  description={t("welcomer_cycle.description")}
                  value={server.serverData?.welcome_image_cycle || "Random"}
                  data={["Random", "Daily", "Weekly", "Monthly", "PerUser"].map(
                    (v) => {
                      return {
                        value: v,
                        label: t(`welcomer_cycle.options.${v}`),
                      };
                    }
                  )}
                  onChange={(value) => {
                    server.updateConfig("welcome_image_cycle", value);
                  }}
                />
              </SimpleGrid>
              <Input.Wrapper
                label={tg("message")}
                description={t("welcome.message_description")}
              >
                <RichTextEditor editor={welcome_editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  {welcome_editor && (
                    <BubbleMenu editor={welcome_editor}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Link />
                      </RichTextEditor.ControlsGroup>
                    </BubbleMenu>
                  )}

                  <ScrollArea.Autosize
                    scrollbarSize={6}
                    style={{
                      "& > div": {
                        width: "100%",
                      },
                    }}
                  >
                    <RichTextEditor.Content />
                  </ScrollArea.Autosize>

                  {welcome_editor && (
                    <Text bg="var(--mantine-color-body)" p="md" c="dimmed">
                      {t.rich("editor.characters", {
                        amount:
                          welcome_editor.storage.characterCount.characters(),
                        total: server.limits?.welcomerMessageLength || 200,
                      })}
                      <br />
                      {t.rich("editor.words", {
                        count: welcome_editor.storage.characterCount.words(),
                      })}
                    </Text>
                  )}
                </RichTextEditor>
              </Input.Wrapper>
              <Space h="md" />
              <Text>
                {t("templates_note")}
                <List>
                  {TEMPLATES.map((i) => {
                    return (
                      <List.Item key={i}>
                        <b>{`{${i}}`}</b> - {t(`templates.${i}`)}
                      </List.Item>
                    );
                  })}
                </List>
              </Text>
            </Stack>
          </Paper>

          <Paper px="md" py="xs" withBorder className={classes.paper}>
            <Stack gap="xs">
              <Title order={1}>{t("goodbye.title")}</Title>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <div className={classes.centerVertical}>
                  <Switch
                    label={tg("enabled")}
                    description={t("goodbye.enabled_description")}
                    checked={server.serverData?.send_goodbye}
                    onChange={(e) => {
                      server.updateConfig("send_goodbye", e.target.checked);
                    }}
                  />
                </div>
                <Select
                  label={tg("channel")}
                  description={t("goodbye.channel_description")}
                  value={server.serverData?.goodbye_channel || "0"}
                  data={server?.textChannels}
                  onChange={(value) => {
                    server.updateConfig("goodbye_channel", value);
                  }}
                />
              </SimpleGrid>
              <SimpleGrid cols={{ base: 1, md: 2 }}>
                <TagsInput
                  label={tg("image")}
                  description={t("goodbye.image_description")}
                  value={server.serverData?.goodbye_image || []}
                  onChange={(value) => {
                    server.updateConfig("goodbye_image", value);
                  }}
                  clearable
                />
                <Select
                  label={t("welcomer_cycle.label")}
                  description={t("welcomer_cycle.description")}
                  value={server.serverData?.goodbye_image_cycle || "Random"}
                  data={["Random", "Daily", "Weekly", "Monthly", "PerUser"].map(
                    (v) => {
                      return {
                        value: v,
                        label: t(`welcomer_cycle.options.${v}`),
                      };
                    }
                  )}
                  onChange={(value) => {
                    server.updateConfig("goodbye_image_cycle", value);
                  }}
                />
              </SimpleGrid>
              <Input.Wrapper
                label={tg("message")}
                description={t("goodbye.message_description")}
              >
                <RichTextEditor editor={goodbye_editor}>
                  <RichTextEditor.Toolbar sticky stickyOffset={60}>
                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Bold />
                      <RichTextEditor.Italic />
                      <RichTextEditor.Underline />
                      <RichTextEditor.Strikethrough />
                      <RichTextEditor.ClearFormatting />
                      <RichTextEditor.Code />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Blockquote />
                      <RichTextEditor.BulletList />
                      <RichTextEditor.OrderedList />
                    </RichTextEditor.ControlsGroup>

                    <RichTextEditor.ControlsGroup>
                      <RichTextEditor.Link />
                      <RichTextEditor.Unlink />
                    </RichTextEditor.ControlsGroup>
                  </RichTextEditor.Toolbar>

                  {goodbye_editor && (
                    <BubbleMenu editor={goodbye_editor}>
                      <RichTextEditor.ControlsGroup>
                        <RichTextEditor.Bold />
                        <RichTextEditor.Italic />
                        <RichTextEditor.Link />
                      </RichTextEditor.ControlsGroup>
                    </BubbleMenu>
                  )}

                  <ScrollArea.Autosize
                    scrollbarSize={6}
                    style={{
                      "& > div": {
                        width: "100%",
                      },
                    }}
                  >
                    <RichTextEditor.Content />
                  </ScrollArea.Autosize>

                  {goodbye_editor && (
                    <Text bg="var(--mantine-color-body)" p="md" c="dimmed">
                      {t.rich("editor.characters", {
                        amount:
                          goodbye_editor.storage.characterCount.characters(),
                        total: server.limits?.welcomerMessageLength || 200,
                      })}
                      <br />
                      {t.rich("editor.words", {
                        count: goodbye_editor.storage.characterCount.words(),
                      })}
                    </Text>
                  )}
                </RichTextEditor>
              </Input.Wrapper>
              <Space h="md" />
              <Text>
                {t("templates_note")}
                <List>
                  {TEMPLATES.map((i) => {
                    return (
                      <List.Item key={i}>
                        <b>{`{${i}}`}</b> - {t(`templates.${i}`)}
                      </List.Item>
                    );
                  })}
                </List>
              </Text>
            </Stack>
          </Paper>
        </Stack>
      </div>
    </ScrollArea.Autosize>
  );
}
