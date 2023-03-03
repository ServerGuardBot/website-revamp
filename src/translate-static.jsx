import { getLanguages, translate, setLanguage, waitForLoad, getCurrentLanguage } from "./translator.jsx";
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import {
    createStyles, MantineProvider, Text, Select, Avatar, Button, Group, Menu,
    UnstyledButton, Loader, Paper
} from '@mantine/core';
import { authenticated_delete, get_user, setCookie } from "./auth.jsx";
import { IconDashboard, IconLogin, IconLogout, IconUser } from "@tabler/icons";
import { API_BASE_URL } from "./helpers.jsx";

const ourTheme = {
    colors: {
        brand: 
        [
          '#fffedc',
          '#fff8af',
          '#fff37e',
          '#ffee4d',
          '#ffe91e',
          '#e6cf08',
          '#b3a100',
          '#807300',
          '#4d4500',
          '#1b1700',
        ]
    },
    primaryColor: 'brand',
    colorScheme: 'dark'
};

const useStyles = createStyles((theme) => ({
    main: {
        height: '100%',
        padding: 2,
        paddingRight: 5
    },

    paper: {
        backgroundColor: theme.colors.dark[6],
        height: 36,
    },

    user: {
        display: 'block',
        height: '100%',
        color: theme.white,
        borderRadius: theme.radius.sm,
        padding: 2,
        
        '&:hover': {
            backgroundColor: theme.colors.dark[5],
            color: theme.white,
        },
    },
}));

function logout() {
    authenticated_delete(API_BASE_URL + 'auth')
        .then(() => {
            setCookie('auth', '', 1);
            setCookie('refresh', '', 14);
            location.assign('/login');
        });
}

function AccountBox() {
    const { classes, theme } = useStyles();

    const [user, setUser] = useState(undefined);
    const [langs, setLangs] = useState({});
    const [curLang, setCurLang] = useState(getCurrentLanguage());

    useEffect(() => {
        get_user(true)
            .then((res) => {
                setUser(res);
            })
            .catch(() => {
                setUser(0);
            });
        
        getLanguages()
            .then((res) => {
                setLangs(res);
            });
    }, []);

    var formattedLangs = [];
    for (const [index, value] of Object.entries(langs)) {
        formattedLangs.push({
            value: index,
            label: value,
        });
    }

    return (
        <MantineProvider theme={ourTheme}>
            <Group
                className={classes.main}
                spacing={theme.spacing.xs}
            >
                {
                    (langs !== null) && (
                        <Select
                            placeholder="Pick language"
                            searchable
                            withinPortal
                            nothingFound="No options"
                            value={curLang}
                            data={formattedLangs}
                            onChange={(value) => {
                                setLanguage(value)
                                    .then(() => {
                                        setCurLang(value);
                                        translateDocument();
                                    });
                            }}
                        />
                    )
                }
                {
                    (user == undefined) && (
                        <Loader size='xs' variant='dots' />
                    )
                    || (user == 0) && (
                        <a href="/login">
                            <Button>
                                <IconLogin size={theme.fontSizes.lg} style={{marginRight: theme.spacing.xs}} />
                                <Text size={theme.fontSizes.md}>Login</Text>
                            </Button>
                        </a>
                    ) || (
                        <Menu withArrow width={150} position="bottom" transition="pop">
                            <Menu.Target>
                                <Paper
                                    radius="sm"
                                    withBorder
                                    className={classes.paper}
                                >
                                    <UnstyledButton className={classes.user}>
                                        <Group>
                                            <Avatar src={user.avatar} radius="lg" size="sm" />
                                            <Text size={theme.fontSizes.md}>{user.name}</Text>
                                        </Group>
                                    </UnstyledButton>
                                </Paper>
                            </Menu.Target>
                            <Menu.Dropdown>
                                <Menu.Item sx={{fontSize: theme.fontSizes.sm, fontFamily: theme.fontFamily, color: 'white !important'}} component="a" href="/account" icon={<IconUser size={22} stroke={1.5} />}>Dashboard</Menu.Item>
                                {
                                    user.id == 'm6YxwpQd' && (
                                        <Menu.Item sx={{fontSize: theme.fontSizes.sm, fontFamily: theme.fontFamily, color: 'white !important'}} component="a" href="/internal" icon={<IconDashboard size={22} stroke={1.5} />}>Internal</Menu.Item>
                                    )
                                }
                                <Menu.Item sx={{fontSize: theme.fontSizes.sm, fontFamily: theme.fontFamily, color: 'white !important'}} onClick={logout} icon={<IconLogout color={theme.colors.red[6]} size={22} stroke={1.5} />}>Logout</Menu.Item>
                            </Menu.Dropdown>
                        </Menu>
                    )
                }
            </Group>
        </MantineProvider>
    )
}

function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const values = JSON.parse(
        element.getAttribute("data-i18n-opt")
    )
    var translation = translate(key, values);

    element.innerHTML = translation;
}

async function translateDocument() {
    document.querySelectorAll("[data-i18n-key]")
        .forEach(translateElement);
}

waitForLoad().then(function() {
    translateDocument();

    const rootElement = document.getElementById('account-box');
    if (rootElement.hasChildNodes()) {
        ReactDOM.hydrate(<AccountBox />, rootElement);
    } else {
        ReactDOM.render(<AccountBox />, rootElement);
    }
});