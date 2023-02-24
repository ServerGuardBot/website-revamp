import React, { useCallback, useEffect, useState } from 'react';
import { useLoaderData, useLocation, Route, Routes, useParams } from "react-router-dom";
import {
    createStyles, Drawer, MediaQuery, Header, Title, Burger, ScrollArea, Loader
} from '@mantine/core';
import {
    IconHome, IconShieldCheck, IconList, IconTrendingUp, IconMessageReport, IconForbid,
    IconBell, IconMessage, IconGift
} from '@tabler/icons';
import { API_BASE_URL } from '../helpers.jsx';
import { Navigation, NavChoice, ServerNavigation } from "./dashboard.jsx";
import { useViewportSize } from '@mantine/hooks';
import { Dash } from './tabs/dash.jsx';
import { NothingFoundBackground } from '../nothing_found.jsx';
import { Verification } from './tabs/verification.jsx';
import { Logging } from './tabs/logging.jsx';
import { XP } from './tabs/xp.jsx';
import { Welcomer } from './tabs/welcomer.jsx';
import { Filters } from './tabs/filters.jsx';
import { authenticated_get, authenticated_patch } from '../auth.jsx';
import { showNotification } from '@mantine/notifications';
import { FailureNotification, SuccessNotification } from './tabs/notifs.jsx';

const paths = {
    'Dashboard': '/',
    'Verification': '/verification',
    'Logging': '/logs',
    'XP Management': '/xp',
    'Chat Filters': '/filters',
    'Welcomer': '/welcomer',
    'Conversation Starter': '/conversation',
    'Giveaways': '/giveaways'
}

const icons = {
    'Dashboard': IconHome,
    'Verification': IconShieldCheck,
    'Logging': IconList,
    'XP Management': IconTrendingUp,
    'Chat Filters': IconMessageReport,
    'Welcomer': IconBell,
    'Conversation Starter': IconMessage,
    'Giveaways': IconGift
}

const useStyles = createStyles((theme) => ({
    app: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
    },

    page: {
        flexGrow: 1,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: '100vw',
        },
    },

    pageScroll: {
        minHeight: 'calc(100% - 43px)',

        '& .mantine-ScrollArea-root': {
            height: '100%',
        },

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: '100vw !important',
        },
    },

    header: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        height: 43,
    },

    content: {
        flexGrow: 1,
        padding: theme.spacing.md,
        height: 'calc(100% - 43px)',

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            width: '100vw !important',
        },
    },

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
}));

export default function Servers(props) {
    const { classes, theme } = useStyles();
    const [defaultSelected, setDefaultSelected] = useState('Dashboard');
    const [navOpened, setNavOpened] = useState(false);
    let routerLocation = useLocation();
    useEffect(() => {
        const re = new RegExp(/servers\/\w+\/(\w+)/);
        const found = routerLocation.pathname.match(re);
        if (found !== null) {
            const testCase = `/${found[1]}`;
            for (const [name, element] of Object.entries(paths)) {
                if (element.toLowerCase() == testCase.toLowerCase()) {
                    setDefaultSelected(name);
                    break
                }
            }
        } else {
            // it's the base route, this is the Dashboard path.
            setDefaultSelected('Dashboard');
        }
    }, [routerLocation]);

    const [notifCooldown, setNotifCooldown] = useState(new Date().getTime() / 1000);

    const [config, setConfig] = useState(null);
    const updateConfig = useCallback((field, newValue) => {
        if (typeof newValue == 'boolean') {
            newValue = newValue ? 1 : 0;
        }
        else if (typeof newValue == 'object') {
            newValue = JSON.stringify(newValue);
        }

        var newConfig = {}
        for (const [index, value] of Object.entries(config)) {
            if (index == field) {
                if (typeof newValue == 'object') {
                    newConfig[index] = JSON.parse(newValue);
                } else {
                    newConfig[index] = newValue;
                }
            } else {
                newConfig[index] = value;
            }
        }
        setConfig(newConfig);

        authenticated_patch(`${API_BASE_URL}servers/${server.id}/config`, JSON.stringify({
            [field]: newValue,
        }))
            .then((resp) => {
                const now = new Date().getTime() / 1000;
                if (now - notifCooldown > .35) {
                    setNotifCooldown(now);
                    if (resp.ok) {
                        showNotification(SuccessNotification);
                    } else {
                        showNotification(FailureNotification);
                    }
                }
            });
    });

    let { serverObject } = useParams();

    var user = props.user;
    var server = useLoaderData();

    const [serverId, setServerId] = useState(server.id);

    useEffect(() => {
        authenticated_get(`${API_BASE_URL}servers/${serverId}/config`)
            .then((request) => {
                if (request.status == 200) {
                    request.text().then((txt) => {
                        setConfig(JSON.parse(txt));
                    });
                }
            });
    }, [serverId]);

    useEffect(() => {
        setServerId(serverObject.id);
    }, [serverObject]);

    var icon = {
        object: icons[defaultSelected] || IconHome
    }

    const { width } = useViewportSize();
    const [screenWidth, setScreenWidth] = useState(width);

    var navItems = (
        <div style={{display: 'flex'}}>
            <ServerNavigation screenWidth={screenWidth} user={user} server={server} />
            <Navigation screenWidth={screenWidth} default={defaultSelected} user={user} server={server} choices={{
                Dashboard: new NavChoice(IconHome, false, `/servers/${server.id}/`),
                Moderation: {
                    Verification: new NavChoice(IconShieldCheck, false, `/servers/${server.id}/verification`),
                    Logging: new NavChoice(IconList, false, `/servers/${server.id}/logs`),
                    'XP Management': new NavChoice(IconTrendingUp, false, `/servers/${server.id}/xp`),
                    'Chat Filters': new NavChoice(IconMessageReport, false, `/servers/${server.id}/filters`),
                },
                General: {
                    Welcomer: new NavChoice(IconBell, false, `/servers/${server.id}/welcomer`),
                    'Conversation Starter': new NavChoice(IconMessage, true, `/servers/${server.id}/conversation`),
                    Giveaways: new NavChoice(IconGift, true, `/servers/${server.id}/giveaways`)
                }
            }}/>
        </div>
    );

    var nav;

    useEffect(() => {
        setScreenWidth(width);
    }, [width]);
    const burgerTitle = navOpened ? 'Close navigation' : 'Open navigation';

    if (screenWidth <= theme.breakpoints.sm) {
        nav = (
            <Drawer
                opened={navOpened}
                onClose={() => setNavOpened(false)}
                withCloseButton={false}
                sx={{
                    height: 'calc(100vh - 43px)',
                    top: '43px',

                    '& > .mantine-Drawer-drawer': {
                        height: 'calc(100vh - 43px)',
                        top: '43px',
                    }
                }}
            >
                {navItems}
            </Drawer>
        );
    } else {
        nav = navItems;
    }

    return (
        <div className={classes.app}>
            {nav}
            <div className={classes.page}>
                <Header className={classes.header}>
                    <MediaQuery
                        query={`(min-width: ${theme.breakpoints.sm + 1}px)`}
                        styles={{display: 'none'}}
                    >
                        <Burger
                            opened={navOpened}
                            onClick={() => setNavOpened((o) => !o)}
                            title={burgerTitle}
                        />
                    </MediaQuery>
                    <icon.object style={{marginRight: `${theme.spacing.sm}px`, marginLeft: `${theme.spacing.sm}px`}} size={28} stroke={1.5} />
                    <Title order={3}>{defaultSelected}</Title>
                </Header>
                {
                    config == null && (
                        <div className={classes.loading}>
                            <Loader size='xl' variant='dots' />
                        </div>
                    ) || (
                        <ScrollArea.Autosize w="calc(100vw - 380px)" maxHeight='calc(100% - 43px)' scrollbarSize={6} className={classes.pageScroll}>
                            <div style={{width: "calc(100vw - 380px)"}} className={classes.content}>
                                    <Routes>
                                        <Route exact path='/' element={<Dash config={config} user={user} updateConfig={updateConfig} server={server} />} />
                                        <Route exact path='/verification' element={<Verification config={config} updateConfig={updateConfig} user={user} server={server} />} />
                                        <Route exact path='/logs' element={<Logging config={config} updateConfig={updateConfig} user={user} server={server} />} />
                                        <Route exact path='/xp' element={<XP config={config} updateConfig={updateConfig} user={user} server={server} />} />
                                        <Route exact path='/welcomer' element={<Welcomer config={config} updateConfig={updateConfig} user={user} server={server} />} />
                                        <Route exact path='/filters' element={<Filters config={config} updateConfig={updateConfig} user={user} server={server} />} />
                                        <Route path='/*' element={<NothingFoundBackground />} />,
                                    </Routes>
                            </div>
                        </ScrollArea.Autosize>
                    )
                }
            </div>
        </div>
    );
}