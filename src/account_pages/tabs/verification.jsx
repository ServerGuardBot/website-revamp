import React, { useState } from 'react';
import {
    createStyles, Text, Title, Paper, Input, Select, Tooltip, Grid, ScrollArea, Button, Group,
    Switch, Slider, MultiSelect
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

export function Verification({user, server}) {
    const { classes, theme } = useStyles();

    const [blockTOR, setBlockTOR] = useState(false); // TODO: Pull from config once the server component is designed to pass config to tabs
    const [blockRG, setBlockRG] = useState(false); // TODO: Pull from config once the server component is designed to pass config to tabs
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
                        <Input.Wrapper id="logs_channel" label="Logs Channel">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                rightSection={
                                    <Tooltip label="Not Yet Supported" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="verify_channel" label="Verification Channel">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                rightSection={
                                    <Tooltip label="Not Yet Supported" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="verified_role" label="Verified Role">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                rightSection={
                                    <Tooltip label="Not Yet Supported" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="unverified_role" label="Unverified Role">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                rightSection={
                                    <Tooltip label="Not Yet Supported" position="top-end" withArrow>
                                        <div>
                                            <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                        </div>
                                    </Tooltip>
                                }
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="block_tor" label="Block TOR Exit Nodes" description="When enabled, Server Guard will block any verification attempts from the TOR network">
                            <Switch
                                checked={blockTOR}
                                onChange={(event) => setBlockTOR(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="raid_guard" label="Raid Guard" description="Raid Guard attempts to automatically block and intercept raid attempts">
                            <Switch
                                disabled
                                checked={blockRG}
                                onChange={(event) => setBlockRG(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                </Grid>
            </Paper>
            <Paper
                radius="md"
                withBorder
                p="md"
                className={classes.paper}
            >
                <Title order={2}>
                    <Tooltip label="Coming Soon" position="top-start" withArrow>
                        <div style={{display: 'inline-block', marginRight: '5px'}}>
                            <IconAlertCircle size={26} style={{ display: 'block', opacity: 0.5 }} />
                        </div>
                    </Tooltip>
                    Rule Enforcement
                </Title>
                <Text className={classes.title} color="dimmed">Automated rules which Server Guard will reject verification if a user does not meet any of these rules</Text>
                <Grid grow columns={2}>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="toxicity" label="Profile Toxicity" description="How certain the bot needs to be of toxicity in the user's profile">
                            <Slider
                                disabled
                                defaultValue={Math.random() * 100}
                                step={1}
                                label={(value) => `${value}%`}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="hatespeech" label="Profile Hate-Speech" description="How certain the bot needs to be of hate-speech in the user's profile">
                            <Slider
                                disabled
                                defaultValue={Math.random() * 100}
                                step={1}
                                label={(value) => `${value}%`}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Group
                            spacing={theme.spacing.xs}
                            align="start"
                        >
                            <Tooltip label="Premium Tier 1" position="top-start" withArrow>
                                <div>
                                    <IconStar size={22} style={{ display: 'block', opacity: 0.5 }} />
                                </div>
                            </Tooltip>
                            <Input.Wrapper style={{flexGrow: 1}} id="nsfw" label="Avatar/Banner NSFW" description="How certain the bot needs to be of NSFW in the user's avatar or banner">
                                <Slider
                                    disabled
                                    defaultValue={Math.random() * 100}
                                    step={1}
                                    label={(value) => `${value}%`}
                                />
                            </Input.Wrapper>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="block_words" label="Word Blacklist" description="Blacklist words in names or bios">
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