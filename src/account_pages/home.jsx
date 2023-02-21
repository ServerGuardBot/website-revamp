import React from 'react';
import { createStyles, Avatar, Text, Paper, Group, Title, ScrollArea } from '@mantine/core';
import { Link } from 'react-router-dom';

const useStyles = createStyles((theme, _params, getRef) => ({
    home: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        maxWidth: '95vw',
        paddingBottom: 10,
    },

    paper: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
    },

    noLinkDecoration: {
        textDecoration: 'none',

        '&, &:link, &:visited': {
            color: 'unset',
        },
    },

    logo: {
        '--size': '30px',
        width: 'var(--size)',
        height: 'var(--size)',
    },

    serverList: {
        '--size': '128px',
        '--gap': `${theme.spacing.sm}px`,
        display: 'grid',
        gridTemplateRows: 'auto',
        gridTemplateColumns: 'repeat(auto-fill, var(--size))',
        justifyContent: 'center',
        justifyItems: 'center',
        rowGap: 'var(--gap)',
        columnGap: 'var(--gap)',
        maxWidth: '100%',
        width: 'calc(calc(var(--size) + var(--gap)) * 6)',

        '& a, & a:link, &a:visited': {
            textDecoration: 'none',
            color: 'unset',
        },
    },

    server: {
        width: 'auto',
        height: 'auto',

        '&:hover': {
            [`& .${getRef('serverIcon')}`]: {
                filter: 'brightness(.7)',
            },
        },
    },

    serverDisabled: {
        opacity: .5,

        '&:hover': {
            [`& .${getRef('serverIcon')}`]: {
                filter: 'unset',
            },
        },
    },

    serverIcon: {
        ref: getRef('serverIcon'),
        width: 'var(--size)',
        height: 'var(--size)',
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.dark[9],
        marginBottom: theme.spacing.xs,
        transition: `filter .15s`,
    },

    serverName: {
        textAlign: 'center',
        fontWeight: 600,
        textDecoration: 'none',
    },
}));

function Server(props) {
    const { classes, cx } = useStyles();
    var data = props.data;

    if (data.active) {
        return (
            <Link to={`/servers/${data.id}`}>
                <div className={cx(classes.server, { [classes.serverDisabled]: !data.active })}>
                    <img src={(data.avatar != null) ? data.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} alt={`${data.name} Server Icon`} className={classes.serverIcon} />
                    <Text className={classes.serverName}>{data.name}</Text>
                </div>
            </Link>
        )
    } else {
        return (
            <div className={cx(classes.server, { [classes.serverDisabled]: !data.active })}>
                <img src={(data.avatar != null) ? data.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} alt={`${data.name} Server Icon`} className={classes.serverIcon} />
                <Text className={classes.serverName}>{data.name}</Text>
            </div>
        )
    }
}

export default function Home(props) {
    const { classes } = useStyles();
    const user = props.user;

    return (
        <div className={classes.home}>
            <Paper
                radius="md"
                withBorder
                p="md"
                sx={(theme) => ({
                    width: 'auto',
                    marginTop: theme.spacing.sm,
                })}
                className={classes.paper}
            >
                <a href='https://serverguard.xyz/' className={classes.noLinkDecoration}>
                    <Group position='center'
                        sx={(theme) => ({
                            marginBottom: theme.spacing.xs,
                        })}
                        spacing="sm"
                    >
                        
                            <img src="/images/logo.svg" alt="logo" className={classes.logo} />
                            <Text weight={800} size="md">SERVER GUARD</Text>
                    </Group>
                </a>
                <Group>
                    <Avatar src={user.avatar} alt="User Avatar" size={120} radius={120} />
                    <Title order={1}>Hello, {user.name}</Title>
                </Group>
            </Paper>
            <Paper
                radius="md"
                withBorder
                p="md"
                sx={(theme) => ({
                    marginTop: theme.spacing.sm,
                })}
                className={classes.paper}
            >
                <div className={classes.serverList}>
                    {
                        user.guilds.map((guild, index) => <Server data={guild} />)
                    }
                </div>
            </Paper>
        </div>
    )
}