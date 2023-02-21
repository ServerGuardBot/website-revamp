import React, { useState } from 'react';
import {
    createStyles, Title, Paper, Input, Select, Tooltip, Grid, Group,
    Switch,
    Slider,
    MultiSelect
} from '@mantine/core';
import { IconAlertCircle, IconStar } from '@tabler/icons';

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

export function Filters({user, server, config}) {
    const { classes, theme } = useStyles();

    const [maliciousURLFilter, setMaliciousURLFilter] = useState(config?.url_filter == 1); // TODO: Pull from config once the server component is designed to pass config to tabs
    const [inviteFilter, setInviteFilter] = useState(config?.invite_link_filter == 1); // TODO: Pull from config once the server component is designed to pass config to tabs
    const [duplicateFilter, setDuplicateFilter] = useState(config?.automod_duplicate == 1); // TODO: Pull from config once the server component is designed to pass config to tabs
    const [blacklistedWords, setBlacklistedWords] = useState([]);

    return (
        <div>
            <Paper
                radius="md"
                withBorder
                p="md"
                className={classes.paper}
            >
                <Title className={classes.title} order={2}>Settings</Title>
                <Grid grow columns={2}>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="malicious_filter" label="Block Malicious URLs" description="Filters out known malicious URLs from a public database">
                            <Switch
                                checked={maliciousURLFilter}
                                onChange={(event) => setMaliciousURLFilter(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="invite_filter" label="Block Invite Links" description="Blocks Discord & Guilded invite links">
                            <Switch
                                checked={inviteFilter}
                                onChange={(event) => setInviteFilter(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="duplicate_filter" label="Block Duplicate Text" description="Blocks duplicate or spammy text">
                            <Switch
                                checked={duplicateFilter}
                                onChange={(event) => setDuplicateFilter(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="spam" label="Spam" description="How many messages must be sent within 3 seconds of each other to trigger the spam filter">
                            <Slider
                                defaultValue={0}
                                step={1}
                                min={0}
                                max={8}
                                label={(value) => (value == 0) ? 'DISABLED' : value}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="toxicity" label="Toxicity Filter" description="How certain the bot must be of a toxicity detection to act on it">
                            <Slider
                                defaultValue={0}
                                step={1}
                                min={0}
                                max={100}
                                label={(value) => (value == 0) ? 'DISABLED' : `${value}%`}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="hatespeech" label="Hate-speech Filter" description="How certain the bot must be of a hate-speech detection to act on it">
                            <Slider
                                defaultValue={0}
                                step={1}
                                min={0}
                                max={100}
                                label={(value) => (value == 0) ? 'DISABLED' : `${value}%`}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="block_words" label="Word Blacklist" description="Blacklist words in messages, automatically detects potential variants of listed words.">
                            <MultiSelect
                                data={blacklistedWords}
                                placeholder="Add words"
                                creatable
                                searchable
                                getCreateLabel={(query) => `+ Add "${query}"`}
                                onCreate={(query) => {
                                    const item = { value: query, label: query };
                                    setBlacklistedWords((current) => [...current, item]);
                                    return item;
                                }}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}