import React, { useState } from 'react';
import {
    createStyles, Title, Paper, Input, Select, Tooltip, Grid, Group,
    Switch
} from '@mantine/core';
import { IconStar } from '@tabler/icons';
import { generateChannels } from '../../helpers.jsx';

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

export function Logging({user, server, config, updateConfig}) {
    const { classes, theme } = useStyles();

    const [logCommands, setLogCommands] = useState(config?.log_commands == 1);
    const [silenceCommands, setSC] = useState(config?.silence_commands == 1);
    const [logRoles, setLR] = useState(config?.log_role_changes == 1);

    const serverChannels = generateChannels(config?.__cache?.channels, ['chat', 'voice']);

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
                        <Input.Wrapper id="log_commands" label="Log Commands" description="Log when moderators use commands">
                            <Switch
                                checked={logCommands}
                                onChange={switchChanged('log_commands', setLogCommands)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="silence_commands" label="Silence Commands" description="Remove the message when a moderator uses a command">
                            <Switch
                                checked={silenceCommands}
                                onChange={switchChanged('silence_commands', setSC)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={2}>
                        <Input.Wrapper id="log_role_changes" label="Log Role Changes" description="Whether or not to log when a user's roles change">
                            <Switch
                                checked={logRoles}
                                onChange={switchChanged('log_role_changes', setLR)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="action_logs_channel" label="Action Logs Channel" description="Logs channel for actions like bans or kicks">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                value={config?.action_logs_channel}
                                data={serverChannels}
                                className={classes.inputGap}
                                onChange={(value) => {
                                    updateConfig('action_logs_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="message_logs_channel" label="Message Logs Channel" description="Message logs for when messages are edited or deleted">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                value={config?.message_logs_channel}
                                data={serverChannels}
                                className={classes.inputGap}
                                onChange={(value) => {
                                    updateConfig('message_logs_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="traffic_logs_channel" label="Traffic Logs Channel" description="Traffic logs for when users join/leave the server">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                value={config?.traffic_logs_channel}
                                data={serverChannels}
                                className={classes.inputGap}
                                onChange={(value) => {
                                    updateConfig('traffic_logs_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Group
                            spacing={theme.spacing.xs}
                            align="start"
                        >
                            <Tooltip label="Premium Tier 1" position="top-start" withArrow>
                                <div>
                                    <IconStar size={22} style={{ display: 'block', opacity: 0.5 }} />
                                </div>
                            </Tooltip>
                            <Input.Wrapper style={{flexGrow: 1}} id="nsfw_logs_channel" label="NSFW Logs Channel" description="Logs for when the bot detects NSFW">
                                <Select
                                    disabled={serverChannels.length == 0 || server.premium < 1}
                                    placeholder="Pick one"
                                    searchable
                                    withinPortal
                                    nothingFound="No options"
                                    value={config?.nsfw_logs_channel}
                                    data={serverChannels}
                                    className={classes.inputGap}
                                    onChange={(value) => {
                                        updateConfig('nsfw_logs_channel', value);
                                    }}
                                />
                            </Input.Wrapper>
                        </Group>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="user_logs_channel" label="User Logs Channel" description="Logs channel for user-related changes like roles">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                value={config?.user_logs_channel}
                                data={serverChannels}
                                className={classes.inputGap}
                                onChange={(value) => {
                                    updateConfig('user_logs_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="management_logs_channel" label="Management Logs Channel" description="Logs channel for things like channel creation">
                            <Select
                                disabled={serverChannels.length == 0}
                                placeholder="Pick one"
                                searchable
                                withinPortal
                                nothingFound="No options"
                                value={config?.management_logs_channel}
                                data={serverChannels}
                                className={classes.inputGap}
                                onChange={(value) => {
                                    updateConfig('management_logs_channel', value);
                                }}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}