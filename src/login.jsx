import { translate, waitForLoad } from "./translator.jsx";
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import {
    createStyles, MantineProvider, Paper, Text, Loader, UnstyledButton
} from '@mantine/core';
import { setCookie, authenticated_get, authenticated_post } from "./auth.jsx";
import { API_BASE_URL } from "./helpers.jsx";
import { IconCheck, IconCopy } from "@tabler/icons";
import { useClipboard } from "@mantine/hooks";
import { NotificationsProvider, showNotification } from "@mantine/notifications";

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
    colorScheme: 'dark',
};

const useStyles = createStyles((theme) => ({
    main: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

    paper: {
        backgroundColor: theme.colors.dark[8],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },

    loginSend: {
        marginTop: theme.spacing.xs,
        '& a': {
            color: 'unset',
            textDecoration: 'none',
            backgroundColor: theme.colors.dark[6],
            borderRadius: theme.radius.xs,
            padding: 4,
            fontWeight: 600,

            '&:hover': {
                backgroundColor: theme.colors.dark[5],
            },
        },
    },
}));

function LoginApp() {
    const { classes, theme } = useStyles();
    const [code, setCode] = useState('');
    const [translationsReady, setTranslationsReady] = useState(false);
    const [currentLock, setCurrentLock] = useState(crypto.randomUUID());
    const [timer, setTimer] = useState(0);

    const clipboard = useClipboard({ timeout: 500 });

    function codeReceived(request) {
        if (request.status == 403) {
            location.assign(`${location.origin}/account`); // Already logged in, redirect to account page
        } else if (request.status == 200) {
            request.text()
                .then((txt) => {
                    let js = JSON.parse(txt);
                    setCode(js.code);
                });
        }
    }

    function codeStatusReceived(response) {
        if (response.status == 404) {
            setCode('');
            setCurrentLock(crypto.randomUUID());
            authenticated_post(API_BASE_URL + 'auth', JSON.stringify({
                lock: currentLock
            }), true)
                .then(codeReceived);
        }
        else if (response.status == 200) {
            response.text()
                .then((txt) => {
                    const msg = JSON.parse(txt);
                    setCookie('auth', msg.auth, 1);
                    setCookie('refresh', msg.refresh, 14);
                    location.assign(`${location.origin}/account`);
                });
        }
    }

    useEffect(() => {
        const interval = setInterval(() => setTimer(timer + 1), 1000);

        if (code != '') {
            authenticated_get(API_BASE_URL + `auth/status/${code}?lock=${encodeURIComponent(currentLock)}`, true)
                .then(codeStatusReceived);
        }

        return () => clearInterval(interval);
    }, [timer]);

    useEffect(() => {
        waitForLoad()
            .then(() => {
                setTranslationsReady(true);
            });

        authenticated_post(API_BASE_URL + 'auth', JSON.stringify({
            lock: currentLock
        }), true)
            .then(codeReceived);
    }, []);

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
            <NotificationsProvider limit={5}>
                <div className={classes.main}>
                    <Paper
                        radius="md"
                        withBorder
                        p="md"
                        className={classes.paper}
                    >
                        {
                            translationsReady == false && (
                                <div className={classes.loading}>
                                    <Loader size='xl' variant='dots' />
                                </div>
                            ) || (
                                <>
                                    {
                                        code == '' && (
                                            <Loader size='md' variant='dots' />
                                        ) || (
                                            <>
                                                <UnstyledButton onClick={() => {
                                                    clipboard.copy(code);
                                                    showNotification({
                                                        closeButtonProps: { 'aria-label': 'Hide notification' },
                                                        icon: <IconCheck size={18} />,
                                                        color: "teal",
                                                        title: "Copied Code",
                                                    });
                                                }}>
                                                    <Text
                                                        size="xl"
                                                        sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                        }}
                                                    ><IconCopy size={theme.fontSizes.xl} /> {code}</Text>
                                                </UnstyledButton>
                                                <Text className={classes.loginSend} dangerouslySetInnerHTML={{
                                                    __html: translate('login.send'),
                                                }} />
                                                <Text mt={theme.spacing.xs}>{translate('login.notice')}</Text>
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </Paper>
                </div>
            </NotificationsProvider>
        </MantineProvider>
    )
}

ReactDOM.render(<LoginApp />, document.getElementById('app'));