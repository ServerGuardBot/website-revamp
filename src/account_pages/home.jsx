import React from 'react';
import { Avatar, Text, Paper, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const paperTheme = (theme) => ({
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
})

function Server(props) {
    var data = props.data;

    if (data.active) {
        return (
            <Link to={`/servers/${data.id}`}>
                <div className={`server ${(data.active) ? 'enabled' : 'disabled'}`}>
                    <img src={(data.avatar != null) ? data.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} alt={`${data.name} Server Icon`} className="icon" />
                    <Text>{data.name}</Text>
                </div>
            </Link>
        )
    } else {
        return (
            <div className={`server ${(data.active) ? 'enabled' : 'disabled'}`}>
                <img src={(data.avatar != null) ? data.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} alt={`${data.name} Server Icon`} className="icon" />
                <Text>{data.name}</Text>
            </div>
        )
    }
}

export default function Home(props) {
    const user = props.user;

    return (
        <div className="home">
            <Paper
                radius="md"
                withBorder
                p="md"
                sx={(theme) => ({
                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
                    width: 'auto',
                    marginTop: '35px'
                })}
            >
                <a href='https://serverguard.xyz/' className='no-link-decoration'>
                    <Group position='center'
                        sx={(theme) => ({
                            marginBottom: '5px'
                        })}
                        spacing="sm"
                    >
                        
                            <img src="../images/logo.svg" alt="logo" className="logo" />
                            <Text size="sm">SERVER GUARD</Text>
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
                sx={paperTheme}
                className="paper"
            >
                <div className='server-list'>
                    {
                        user.guilds.map((guild, index) => <Server data={guild} />)
                    }
                </div>
            </Paper>
        </div>
    )
}