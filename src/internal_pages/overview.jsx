import React, { useEffect, useState } from 'react';
import {
    createStyles, Text, Title, Paper, ThemeIcon, SimpleGrid, Group, Loader, Stack, Avatar, RingProgress, Center
} from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight, IconCpu, IconDeviceAnalytics, IconServer } from '@tabler/icons';
import { authenticated_get } from '../auth.jsx';
import { API_BASE_URL } from '../helpers.jsx';

const WEEK_SECONDS = 60 * 60 * 24 * 7;

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

function StatRing({ icon, label, stats, mainStat }) {
    const { classes, theme, cx } = useStyles();
    return (
        <Paper className={classes.paper} mt={0} withBorder radius="md" p="xs" key={label}>
            <Group>
                <RingProgress
                    size={120}
                    thickness={10}
                    sections={stats.map((stat) => {
                        return { value: stat.progress, color: stat.color }
                    })}
                    label={
                    <Center>
                        <icon.icon size="1.6rem" stroke={1.5} />
                    </Center>
                    }
                />

                <div>
                    <Text color="dimmed" size="sm" transform="uppercase" weight={700}>
                        {label}
                    </Text>
                    <Text weight={700} size={26}>
                        {mainStat}
                    </Text>
                </div>
            </Group>
      </Paper>
    )
}

function StatIcon({ title, value, diff }) {
    const { classes, theme, cx } = useStyles();
    const DiffIcon = diff >= 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
        <Paper className={classes.paper} mt="md" withBorder p="md" radius="md" key={title}>
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
                {diff >= 0 ? 'increase' : 'decrease'} compared to last week
            </Text>
        </Paper>
    )
}

function getValues(arr) {
    if (arr.length == 0) {
        return [0, 0];
    }
    else if (arr.length == 1) {
        const value = arr[0].value;
        return [value, 0];
    }
    else {
        const itemA = arr[arr.length - 1].value;
        var itemB = arr[arr.length - 2].value;

        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];
            if (Math.abs(element.time - arr[arr.length - 1].time) >= WEEK_SECONDS) {
                itemB = element.value;
                break
            }
        }

        return (itemA - itemB == 0) ? [itemA, 0] : [itemA, (itemA - itemB) / itemA * 100]
    }
}

export function Overview({ user }) {
    const { classes, theme, cx } = useStyles();

    const [loaded, setLoaded] = useState(false);
    const [largestServers, setLS] = useState([]);
    const [serverCount, setSC] = useState([]);
    const [userCount, setUC] = useState([]);
    const [premiumCount, setPC] = useState([]);
    const [disk, setDisk] = useState([]);
    const [memory, setMemory] = useState([]);
    const [cpu, setCPU] = useState(0);

    useEffect(() => {
        authenticated_get(API_BASE_URL + 'analytics/servers/dash/30')
            .then((response) => {
                response.text()
                    .then((txt) => {
                        const json = JSON.parse(txt);
                        setSC(json.servers);
                        setLS(json.largestServers || largestServers);
                        setUC(json.users || userCount);
                        setPC(json.premium || premiumCount);
                        setDisk(json.disk);
                        setMemory(json.ram);
                        setCPU(json.cpu);
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
                            <StatRing label="CPU" icon={{icon: IconCpu}}
                                mainStat={`${cpu.toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 1 }
                                )}%`}
                                stats={[{
                                    progress: cpu,
                                    color: theme.colors.blue[6],
                                }]}
                            />
                            <StatRing label="Memory" icon={{icon: IconDeviceAnalytics}}
                                 mainStat={`${memory[0].toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 1 }
                                )}%`}
                                stats={[{
                                    progress: (memory[2] / memory[1]) * 100,
                                    color: theme.colors.orange[6],
                                }, {
                                    progress: (memory[3] / memory[1]) * 100,
                                    color: theme.colors.blue[6],
                                }]}
                            />
                            <StatRing label="Disk" icon={{icon: IconServer}} mainStat={`${((disk[1]/disk[0]) * 100).toLocaleString(
                                    undefined,
                                    { minimumFractionDigits: 1 }
                                )}%`}
                                stats={[{
                                    progress: (disk[1] / disk[0]) * 100,
                                    color: theme.colors.orange[6],
                                }, {
                                    progress: (disk[2] / disk[0]) * 100,
                                    color: theme.colors.blue[6],
                                }]}
                            />
                        </SimpleGrid>
                        <SimpleGrid cols={3} breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
                            <StatIcon title="Servers" value={getValues(serverCount)[0]} diff={getValues(serverCount)[1]} />
                            <StatIcon title="Users" value={getValues(userCount)[0]} diff={getValues(userCount)[1]} />
                            <StatIcon title="Premium Users" value={getValues(premiumCount)[0]} diff={getValues(premiumCount)[1]} />
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