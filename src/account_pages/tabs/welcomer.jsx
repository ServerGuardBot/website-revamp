import React, { useEffect, useRef, useState } from 'react';
import {
    createStyles, Title, Paper, Input, Select, Grid, Group,
    Switch, Text, ScrollArea, Dialog, Button, TextInput, List
} from '@mantine/core';
import { RichTextEditor, Link } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { generateChannels, isValidURL } from '../../helpers.jsx';
import { useDebouncedValue } from '@mantine/hooks';
import { HtmlRenderer, Parser } from 'commonmark';
import TurndownService from 'turndown';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        marginTop: theme.spacing.xl,

        '&:first-child': {
            marginTop: 0,
        },
    },

    danger: {
        backgroundColor: theme.colors.red[7],
        borderColor: theme.colors.red[9],
    },

    nonRelative: {
        position: 'unset',
    },

    title: {
        marginBottom: theme.spacing.sm,
    },

    inputGap: {
        marginTop: theme.spacing.xs,
    },
}));

TurndownService.prototype.escape = (str) => str;
const turndownService = new TurndownService();

const reader = new Parser();
const writer = new HtmlRenderer();

export function Welcomer({user, server, config, updateConfig}) {
    const { classes, theme } = useStyles();

    const content = 
        writer.render(
            reader.parse(config?.welcome_message || 'Welcome, {mention}, to **{server_name}**!')
        );

    const [imageURL, setImageURL] = useState(config?.welcome_image || '');
    const [debouncedImageURL] = useDebouncedValue(imageURL, 200);
    const [enabled, setEnabled] = useState(config?.use_welcome == 1);
    const [message, setMessage] = useState(content);
    const [messageDirty, setMessageDirty] = useState(false);

    const serverChannels = generateChannels(config?.__cache?.channels, ['chat', 'voice']);

    const extensions = [
        StarterKit,
        Underline,
        Link,
        Placeholder.configure({
            placeholder: 'Write your welcome message',
        }),
        CharacterCount.configure({
            limit: 200,
        }),
    ];

    const editor = useEditor({
        extensions: extensions,
        onUpdate: ({ editor }) => {
            let html = editor.getHTML();
            setMessageDirty(html != message);
        },
        content,
    });

    function switchChanged(field, updater) {
        return (event) => {
            updater(event.currentTarget.checked);
            updateConfig(field, event.currentTarget.checked);
        }
    }

    useEffect(() => {
        if ((config?.welcome_image || '') == debouncedImageURL) return // Make sure it doesn't automatically detect a change when the page loads
        if (isValidURL(debouncedImageURL) || debouncedImageURL == '') {
            updateConfig('welcome_image', debouncedImageURL);
        }
    }, [debouncedImageURL]);

    return (
        <div>
            <Dialog
                opened={messageDirty}
                size="lg"
                radius="sm"
            >
                <Text size="lg" style={{ marginBottom: theme.spacing.sm }} weight={500}>
                    Unsaved Changes
                </Text>
                <Group position="right">
                    <Button
                        onClick={() => {
                            var markdown = turndownService.turndown(editor.view.dom.innerHTML);
                            updateConfig('welcome_message', markdown);
                            setMessage(editor.view.dom.innerHTML);
                            setMessageDirty(false);
                        }}
                    >
                        Apply Changes
                    </Button>
                </Group>
            </Dialog>
            <Paper
                radius="md"
                withBorder
                p="md"
                className={classes.paper}
            >
                <Title className={classes.title} order={2}>Settings</Title>
                <Grid grow columns={2}>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="enabled" label="Enabled" description="Whether or not the bot will welcome users">
                            <Switch
                                checked={enabled}
                                onChange={switchChanged('use_welcome', setEnabled)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="channel" label="Channel" description="The channel to welcome users in">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                value={config?.welcome_channel}
                                data={serverChannels}
                                className={classes.inputGap}
                                onChange={(value) => {
                                    updateConfig('welcome_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="image" label="Image" description="A URL to an image the welcomer will use">
                            <TextInput
                                placeholder="Place URL here"
                                value={imageURL}
                                onChange={(event) => setImageURL(event.currentTarget.value)}
                                error={isValidURL(imageURL) ? false : 'Please enter a valid URL'}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col w="100%" span={2}>
                        <Input.Wrapper id="message" label="Message" description="The message welcomer will use">
                            <RichTextEditor className={classes.inputGap} editor={editor}>
                                <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Bold />
                                        <RichTextEditor.Italic />
                                        <RichTextEditor.Underline />
                                        <RichTextEditor.Strikethrough />
                                        <RichTextEditor.ClearFormatting />
                                        <RichTextEditor.Highlight />
                                        <RichTextEditor.Code />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Blockquote />
                                        <RichTextEditor.Hr />
                                        <RichTextEditor.BulletList />
                                        <RichTextEditor.OrderedList />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Link />
                                        <RichTextEditor.Unlink />
                                    </RichTextEditor.ControlsGroup>
                                </RichTextEditor.Toolbar>

                                {editor && (
                                    <BubbleMenu editor={editor}>
                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Bold />
                                            <RichTextEditor.Italic />
                                            <RichTextEditor.Link />
                                        </RichTextEditor.ControlsGroup>
                                    </BubbleMenu>
                                )}

                                <ScrollArea.Autosize
                                    scrollbarSize={6}
                                    sx={{
                                        '& > div': {
                                            width: '100%',
                                        },
                                    }}
                                >
                                    <RichTextEditor.Content />
                                </ScrollArea.Autosize>
                                
                                {editor && (
                                    <Text
                                        bg={theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}
                                        p={theme.spacing.md}
                                        color="dimmed"
                                    >
                                        {editor.storage.characterCount.characters()}/200 characters
                                        <br />
                                        {editor.storage.characterCount.words()} words
                                    </Text>
                                )}
                            </RichTextEditor>
                            <Text mt={theme.spacing.sm}>
                                Welcomer's message supports the following template strings:
                                <List>
                                    <List.Item><b>{"{mention}"}</b> - Mentions the user being welcomed</List.Item>
                                    <List.Item><b>{"{server_name}"}</b> - The name of the server</List.Item>
                                </List>
                            </Text>
                        </Input.Wrapper>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}