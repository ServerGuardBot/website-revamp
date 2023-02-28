const VERIFY_REGEX = /\/verify\/([\w\-_]+)/
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});

import { translate, waitForLoad } from "./translator.jsx";
import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom';
import {
    createStyles, MantineProvider, Paper, Text, Loader, Button, Avatar, Group
} from '@mantine/core';
import { setCookie } from "./auth.jsx";
import { API_BASE_URL, http_get, http_post_text } from "./helpers.jsx";
import { IconAlertTriangle, IconShieldCheck, IconShieldX } from "@tabler/icons";
import escapeHTML from 'escape-html-tags';
import CryptoJS from 'crypto-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Turnstile } from '@marsidev/react-turnstile';
import { Adsense } from '@ctrl/react-adsense';

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
        flexDirection: 'column',
    },

    paper: {
        backgroundColor: theme.colors.dark[8],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: theme.spacing.sm,
        width: 480,
        maxWidth: '95vw',

        '& a': {
            textDecoration: 'none',
            color: '#ffe91e',
        }
    },

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
}));

const key = CryptoJS.enc.Utf8.parse(SECRET);

function getCookie(name) {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for(var i=0;i < ca.length;i++) {
        var c = ca[i]
        while (c.charAt(0)==' ') c = c.substring(1,c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
}

function checkVPN() {
    var result
    result = fetch(`https://ipapi.co/json`)
    .then(function(response) { return response.json() })
    .then(function (data) { 
        var bT = Intl.DateTimeFormat().resolvedOptions().timeZone
        var iT = data.timezone
        return iT != bT
    })
    .catch(function() {
        return false
    })
    return result
  }

async function generateBody(turnstileToken) {
    var a = await checkVPN();
    var b = getCookie('b');
    if (b == null) {
        b = window.localStorage.getItem('b');
    }

    if (b == null) {
        const fpPromise = await FingerprintJS.load();
        var fpRes = await fpPromise.get();
        b = fpRes.visitorId; //generateID(60);
        setCookie('b', b, 30 * 6);
    }
    if (window.localStorage.getItem('b') == null) {
        window.localStorage.setItem('b', b);
    }
    if (getCookie('b') == null) {
        setCookie('b', b, 30 * 6);
    }
    setCookie('a', (a == true) ? '1' : '0', 30)
    return CryptoJS.AES.encrypt(JSON.stringify({
        'v': (a == true) ? '1' : '0',
        'bi': b,
        'cf': turnstileToken,
    }), key, {mode: CryptoJS.mode.ECB}).toString();
}

function VerifyApp() {
    const { classes, theme } = useStyles();
    const [data, setData] = useState(null);
    const [status, setStatus] = useState({
        state: 0,
    });
    const [translationsReady, setTranslationsReady] = useState(false);
    const [code, setCode] = useState(null);
    const [turnstileToken, setTurnstileToken] = useState(null);

    useEffect(() => {
        var obj = document.getElementById('app');
        const observer = new MutationObserver(function (mutations, observer) {
            obj.style.height = "";
            document.getElementsByClassName(classes.main)[0].style.height = "";
        });
        observer.observe(obj, {
            attributes: true,
            attributeFilter: ['style']
        });
        
        const re = new RegExp(VERIFY_REGEX);
        var window_code = re.exec(window.location.href);
        let curCode;
        if (window_code !== null) {
            curCode = window_code[1];
        } else {
            curCode = params.code;
        }

        setCode(curCode);

        if (curCode != null) {
            history.replaceState({}, '', `${location.origin}/verify/${curCode}`);
        }

        waitForLoad()
            .then(() => {
                setTranslationsReady(true);

                if (curCode != null) {
                    try {
                        http_get(API_BASE_URL + 'verify/' + curCode, true)
                            .then((response) => {
                                if (response.status == 200) {
                                    response.text()
                                        .then((txt) => {
                                            var userInfo = JSON.parse(txt);
                                            setData({
                                                avatar: userInfo.user_avatar,
                                                username: userInfo.user_name,
                                                server: userInfo.guild_name,
                                                admin_contact: userInfo.admin_contact,
                                                server_id: userInfo.guild_id,
                                            });
                                        });
                                } else {
                                    response.text()
                                        .then((txt) => {
                                            setStatus({
                                                state: 1,
                                                message: translate(`verify.${response.status}.${JSON.parse(txt).message}`) | `[${response.status}] ${txt}`
                                            });
                                        });
                                }
                        });
                    }
                    catch {
                        // Do nothing
                    }
                }
            });
    }, []);

    if (translationsReady == false) {
        return (
            <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
                <div className={classes.main}>
                    <Paper
                        radius="md"
                        withBorder
                        p="md"
                        className={classes.paper}
                    >
                        <div className={classes.loading}>
                            <Loader size='xl' variant='dots' />
                        </div>
                    </Paper>
                </div>
            </MantineProvider>
        )
    }

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
            <div className={classes.main}>
                <Paper
                    radius="md"
                    withBorder
                    p="md"
                    className={classes.paper}
                >
                    {
                        (translationsReady == false || data == null) && (
                            <div className={classes.loading}>
                                <Loader size='xl' variant='dots' />
                            </div>
                        ) || (
                            <>
                                {
                                    (status.state <= 0) && (
                                        <Group position="left">
                                            <Avatar src={data.avatar} radius="xl" size="md" />
                                            <Text size="lg">{
                                                translate('verify.welcome', {
                                                    username: data.username,
                                                })
                                            }</Text>
                                        </Group>
                                    ) // Only render the header if this is not an error/success state
                                }
                                {
                                    (status.state == 1) && (
                                        <IconShieldX size={132} />
                                    ) ||
                                    (status.state == 2) && (
                                        <IconShieldCheck size={132} />
                                    )
                                }
                                <Text
                                    size="md"
                                    mt={theme.spacing.sm}
                                    align="center"
                                    dangerouslySetInnerHTML={{
                                        __html: (status.state == 1) && (
                                            (data.admin_contact !== "" && data.admin_contact !== null) &&
                                            translate('verify.failure.with_contact', {
                                                message: status.message,
                                                admin_contact: escapeHTML(data.admin_contact),
                                            })
                                            || status.message
                                        ) ||
                                        (status.state == 2) && translate('verify.message.success') ||
                                        translate('verify.message.intro', {
                                            server: data.server,
                                        })
                                    }}
                                />
                                {
                                    (status.state <= 0) && (
                                        <Group align="center">
                                            <Turnstile
                                                siteKey={TURNSTILE_KEY}
                                                onSuccess={(token) => {
                                                    setTurnstileToken(token);
                                                }}
                                                onError={() => {
                                                    setTurnstileToken('');
                                                }}
                                                options={{
                                                    size: 'invisible',
                                                }}
                                            />
                                            <Button
                                                size="sm"
                                                mt={theme.spacing.sm}
                                                disabled={status.state == -1 || turnstileToken == null}
                                                onClick={() => {
                                                    gtag('event', 'verify_click', {
                                                        guild_id: data.server_id,
                                                    });
                                                    setStatus({
                                                        state: -1
                                                    });
                                                    generateBody(turnstileToken)
                                                        .then((body) => {
                                                            http_post_text(API_BASE_URL + 'verify/' + code, body, true)
                                                                .then((response) => {
                                                                    if (response.status == 200) {
                                                                        setStatus({
                                                                            state: 2,
                                                                        });
                                                                        gtag('event', 'verify_response', {
                                                                            state: 'success',
                                                                            code: response.status,
                                                                        });
                                                                    }
                                                                    else if (response.status >= 500 && request.status < 600) {
                                                                        // Server Error
                                                                        setStatus({
                                                                            state: 1,
                                                                            message: translate('verify.500') || '[500] Failed to verify due to a server error, if you continue receiving this message please report it in our <a href="https://serverguard.xyz/support">Support Server</a>',
                                                                        });
                                                                        gtag('event', 'verify_response', {
                                                                            state: 'error',
                                                                            code: response.status,
                                                                            message: 'Internal server error',
                                                                        });
                                                                    } else {
                                                                        response.text()
                                                                            .then((txt) => {
                                                                                setStatus({
                                                                                    state: 1,
                                                                                    message: translate(`verify.${response.status}.${JSON.parse(txt).message}`) || `[${response.status}] ${JSON.parse(txt).message}`,
                                                                                });
                                                                                gtag('event', 'verify_response', {
                                                                                    state: 'error',
                                                                                    code: response.status,
                                                                                    message: JSON.parse(txt).message,
                                                                                });
                                                                            });
                                                                    }
                                                                });
                                                        })
                                                }}
                                            >
                                                {
                                                    (status.state == -1) && (
                                                        <Loader size="sm" variant="dots" />
                                                    ) || (
                                                        translate('verify.button')
                                                    )
                                                }
                                            </Button>
                                        </Group>
                                    )
                                }
                            </>
                        )
                    }
                </Paper>
                <Paper
                    radius="md"
                    withBorder
                    p="md"
                    className={classes.paper}
                >
                    <Text
                        size="md"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <IconAlertTriangle style={{marginRight: `${theme.spacing.xs}px`}} size={36} color={theme.colors.orange[6]} />
                        {translate('verify.scamwarning')}
                    </Text>
                </Paper>
                <Paper
                    radius="md"
                    withBorder
                    p="md"
                    className={classes.paper}
                >
                    <Text
                        size="md"
                        align="center"
                        dangerouslySetInnerHTML={{
                            __html: translate('verify.legal'),
                        }}
                    />
                    <Text 
                        size="md"
                        align="center"
                    >
                        {translate('verify.notice')}
                    </Text>
                </Paper>
                <Adsense
                    client="ca-pub-4625689430964513"
                    slot="8619832219"
                    format="horizontal"
                    style={{
                        width: "480px",
                        maxWidth: '95vw',
                        marginTop: theme.spacing.sm,
                        borderRadius: theme.radius.md,
                        overflow: 'hidden',
                    }}
                />
            </div>
        </MantineProvider>
    )
}

ReactDOM.render(<VerifyApp />, document.getElementById('app'));