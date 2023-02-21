import React, { useState } from 'react';
import {
    createStyles, Title, Paper, Input, Select, Tooltip, Grid, Group,
    Switch
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

export function Logging({user, server}) {
    const { classes, theme } = useStyles();

    const [logCommands, setLogCommands] = useState(false); // TODO: Pull from config once the server component is designed to pass config to tabs
    const [silenceCommands, setSC] = useState(false); // TODO: Pull from config once the server component is designed to pass config to tabs

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
                                onChange={(event) => setLogCommands(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="silence_commands" label="Silence Commands" description="Remove the message when a moderator uses a command">
                            <Switch
                                checked={silenceCommands}
                                onChange={(event) => setSC(event.currentTarget.checked)}
                                className={classes.inputGap}
                            />
                        </Input.Wrapper>
                    </Grid.Col>
                    <Grid.Col sm={2} md={1}>
                        <Input.Wrapper id="action_logs_channel" label="Action Logs Channel" description="Logs channel for actions like bans or kicks">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                className={classes.inputGap}
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
                        <Input.Wrapper id="message_logs_channel" label="Message Logs Channel" description="Message logs for when messages are edited or deleted">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                className={classes.inputGap}
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
                        <Input.Wrapper id="traffic_logs_channel" label="Traffic Logs Channel" description="Traffic logs for when users join/leave the server">
                            <Select
                                disabled
                                placeholder="Pick one"
                                searchable
                                nothingFound="No options"
                                data={["Unknown"]}
                                className={classes.inputGap}
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
                                    disabled
                                    placeholder="Pick one"
                                    searchable
                                    nothingFound="No options"
                                    data={["Unknown"]}
                                    className={classes.inputGap}
                                    rightSection={
                                        <Tooltip label="Not Yet Supported" position="top-end" withArrow>
                                            <div>
                                                <IconAlertCircle size={18} style={{ display: 'block', opacity: 0.5 }} />
                                            </div>
                                        </Tooltip>
                                    }
                                />
                            </Input.Wrapper>
                        </Group>
                    </Grid.Col>
                </Grid>
            </Paper>
        </div>
    )
}