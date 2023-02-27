import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Title, Paper, ThemeIcon, SimpleGrid, Group, Loader, Stack, Avatar
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons';
import { authenticated_get } from '../auth.jsx';
import { API_BASE_URL } from '../helpers.jsx';

const useStyles = createStyles((theme) => ({
    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        marginTop: theme.spacing.xl,
    },

    danger: {
        backgroundColor: theme.colors.red[6],
        borderColor: theme.colors.red[9],
    },

    nonRelative: {
        position: 'unset',
    },

    title: {
        marginBottom: theme.spacing.sm,
    },

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
}));

function StatIcon({ title, value, diff }) {
    const { classes, theme, cx } = useStyles();
    const DiffIcon = diff >= 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
        <Paper className={classes.paper} mt={0} withBorder p="md" radius="md" key={title}>
            <Group position="apart">
            <div>
                <Text
                    color="dimmed"
                    transform="uppercase"
                    weight={700}
                    size="xs"
                >
                    {title}
                </Text>
                <Text weight={700} size="xl">
                    {value}
                </Text>
            </div>
            <ThemeIcon
                color="gray"
                variant="light"
                sx={(theme) => ({ color: diff >= 0 ? theme.colors.teal[6] : theme.colors.red[6] })}
                size={38}
                radius="md"
            >
                <DiffIcon size={28} stroke={1.5} />
            </ThemeIcon>
            </Group>
            <Text color="dimmed" size="sm" mt="md">
                <Text component="span" color={diff >= 0 ? 'teal' : 'red'} weight={700}>
                    {diff.toLocaleString(
                        undefined,
                        { minimumFractionDigits: 2 }
                    )}%
                </Text>{' '}
                {diff >= 0 ? 'increase' : 'decrease'} compared to past hour
            </Text>
        </Paper>
    )
}

function getValues(arr) {
    if (arr.length == 0) {
        return [0, 0];
    }
    else if (arr.length == 1) {
        const value = arr[1].value;
        return [value, value];
    }
    else {
        const itemA = arr[arr.length - 1].value;
        const itemB = arr[arr.length - 2].value;

        return (itemA - itemB == 0) ? [itemA, 0] : [itemA, (itemB - itemA) / itemA * 100]
    }
}

export function Overview({ user }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [largestServers, setLS] = useState([]);
    const [serverCount, setSC] = useState([]);
    const [userCount, setUC] = useState([]);

    useEffect(() => {
        authenticated_get(API_BASE_URL + 'analytics/servers/dash/2')
            .then((response) => {
                response.text()
                    .then((txt) => {
                        const json = JSON.parse(txt);
                        setSC(json.servers);
                        setLS(json.largestServers || largestServers);
                        setUC(json.users || userCount);
                        setLoaded(true);
                    });
            });
    }, []);

    return (
        <div>
            {
                (!loaded) && (
                    <div className={classes.loading}>
                        <Loader size='xl' variant='dots' />
                    </div>
                ) || (
                    <>
                        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                            <StatIcon title="Servers" value={getValues(serverCount)[0]} diff={getValues(serverCount)[1]} />
                            <StatIcon title="Users" value={getValues(userCount)[0]} diff={getValues(userCount)[1]} />
                            <StatIcon title="Premium Users" value={0} diff={0} />
                        </SimpleGrid>
                        <Paper
                            radius="md"
                            withBorder
                            p="sm"
                            className={classes.paper}
                        >
                            <Title className={classes.title} order={2}>Top Servers</Title>
                            <Stack spacing="sm">
                                {
                                    largestServers.map((server) =>
                                        <Paper
                                            radius="md"
                                            withBorder
                                            p="sm"
                                            className={classes.paper}
                                            bg={theme.colors.dark[9]}
                                            mt={0}
                                        >
                                            <Group>
                                                <Avatar radius="sm" size="xl" src={server.avatar} />
                                                <div>
                                                    <Text weight={700} size="md" color="dimmed">{server.name}</Text>
                                                    <Text weight={700} size="xl">{server.members.toLocaleString(
                                                        undefined,
                                                        { minimumFractionDigits: 0 }
                                                    )}</Text>
                                                </div>
                                            </Group>
                                        </Paper>
                                    )
                                }
                            </Stack>
                        </Paper>
                    </>
                )
            }
        </div>
    )
}