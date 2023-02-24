import React, { useState, useEffect } from 'react';
import {
    createStyles, Text, Title, Paper, Input, Select, Tooltip, Grid, ScrollArea, Button, Group,
    Switch, Slider, MultiSelect
} from '@mantine/core';
import { IconAlertCircle, IconStar } from '@tabler/icons';
import { generateChannels, generateRoles } from '../../helpers.jsx';
import { getServerInfo } from '../../server_info.jsx';

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

export function Verification({user, server, config, updateConfig}) {
    const { classes, theme } = useStyles();

    const [serverData, setServerData] = useState({});
    useEffect(() => {
        getServerInfo(server.id)
            .then((data) => {
                setServerData(data);
            });
    }, []);
    const serverRoles = generateRoles(serverData?.team?.rolesById);
    const serverChannels = generateChannels(config?.__cache?.channels, ['chat', 'voice']);

    const [blockTOR, setBlockTOR] = useState(config?.block_tor == 1);
    const [raidGuard, setRG] = useState(config?.raid_guard == 1);
    const [blacklistedWords, setBlacklistedWords] = useState([]); // TODO: Make this sync

    function switchChanged(field, updater) {
        return (event) => {
            updater(event.currentTarget.checked);
            updateConfig(field, event.currentTarget.checked);
        }
    }

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
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                defaultValue={config?.verify_logs_channel}
                                data={serverChannels}
                                onChange={(value) => {
                                    updateConfig('verify_logs_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="verify_channel" label="Verification Channel">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                defaultValue={config?.verification_channel}
                                data={serverChannels}
                                onChange={(value) => {
                                    updateConfig('verification_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="verified_role" label="Verified Role">
                            <Select
                                disabled={serverRoles.length == 0}
                                placeholder="Pick one"
                                withinPortal
                                searchable
                                nothingFound="No options"
                                data={serverRoles}
                                defaultValue={(config?.verified_role !== undefined) ? config?.verified_role.toString() : null}
                                onChange={(value) => {
                                    updateConfig('verified_role', parseInt(value));
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="unverified_role" label="Unverified Role">
                            <Select
                                disabled={serverRoles.length == 0}
                                placeholder="Pick one"
                                withinPortal
                                searchable
                                nothingFound="No options"
                                data={serverRoles}
                                defaultValue={(config?.unverified_role !== undefined) ? config.unverified_role.toString() : null}
                                onChange={(value) => {
                                    updateConfig('unverified_role', parseInt(value));
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="block_tor" label="Block TOR Exit Nodes" description="When enabled, Server Guard will block any verification attempts from the TOR network">
                            <Switch
                                checked={blockTOR}
                                onChange={switchChanged('block_tor', setBlockTOR)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="raid_guard" label="Raid Guard" description="Raid Guard attempts to automatically block and intercept raid attempts">
                            <Switch
                                disabled
                                checked={raidGuard}
                                onChange={switchChanged('raid_guard', setRG)}
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
                                defaultValue={config?.rf_toxicity || 0}
                                step={1}
                                label={(value) => `${value}%`}
                                onChangeEnd={(value) => {
                                    updateConfig('rf_toxicity', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="hatespeech" label="Profile Hate-Speech" description="How certain the bot needs to be of hate-speech in the user's profile">
                            <Slider
                                disabled
                                defaultValue={config?.rf_hatespeech || 0}
                                step={1}
                                label={(value) => `${value}%`}
                                onChangeEnd={(value) => {
                                    updateConfig('rf_hatespeech', value);
                                }}
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
                                    defaultValue={config?.rf_nsfw || 0}
                                    step={1}
                                    label={(value) => `${value}%`}
                                    onChangeEnd={(value) => {
                                        updateConfig('rf_nsfw', value);
                                    }}
                                />
                            </Input.Wrapper>
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={2}>
                        <Input.Wrapper id="block_words" label="Word Blacklist" description="Blacklist words in names or bios">
                            <MultiSelect
                                data={blacklistedWords}
                                placeholder="Add words"
                                disabled
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