import React, { useEffect, useState } from 'react';
import { useLoaderData, useLocation, Route, Routes } from "react-router-dom";
import {
    createStyles, Drawer, MediaQuery, Text, Header, Title, Burger
} from '@mantine/core';
import {
    IconHome, IconShieldCheck, IconList, IconTrendingUp, IconMessageReport, IconForbid,
    IconBell, IconMessage, IconGift
} from '@tabler/icons';
import { Navigation, NavChoice, ServerNavigation } from "./dashboard.jsx";
import { useViewportSize } from '@mantine/hooks';

const paths = {
    'Dashboard': '/',
    'Verification': '/verification',
    'Logging': '/logs',
    'XP Management': '/xp',
    'Chat Filters': '/filters',
    'Word Blacklist': '/blacklist',
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
    'Word Blacklist': IconForbid,
    'Welcomer': IconBell,
    'Conversation Starter': IconMessage,
    'Giveaways': IconGift
}

const useStyles = createStyles((theme) => ({
    header: {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[3],
        height: 43,
    },
}));

function Dash(props) {
    var user = props.user;
    var server = props.server;

    return (
        <div className="server-dash">
            <Text>User = {user.name}, Server = {server.name}</Text>
        </div>
    )
}

export default function Servers(props) {
    const { classes, theme } = useStyles();
    const [defaultSelected, setDefaultSelected] = useState('Dashboard');
    const [navOpened, setNavOpened] = useState(false);
    let routerLocation = useLocation();
    useEffect(() => {
        const re = new RegExp(/account\/servers\/\w+\/(\w+)/);
        const found = location.pathname.match(re);
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

    var user = props.user;
    var server = useLoaderData();

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
                    'XP Management': new NavChoice(IconTrendingUp, false, `/servers/${server.id}/xp`)
                },
                Automod: {
                    'Chat Filters': new NavChoice(IconMessageReport, false, `/servers/${server.id}/filters`),
                    'Word Blacklist': new NavChoice(IconForbid, false, `/servers/${server.id}/blacklist`)
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

    if (screenWidth <= 490) {
        nav = (
            <Drawer
                opened={navOpened}
                onClose={() => setNavOpened(false)}
            >
                {navItems}
            </Drawer>
        );
    } else {
        nav = navItems;
    }

    return (
        <div className="server-config">
            {nav}
            <div className="server-page">
                <Header className={classes.header}>
                    <MediaQuery
                        query='(min-width: 491px)'
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
                <div className="dash-servers-content">
                    <Routes>
                        <Route exact path='/' element={<Dash user={user} server={server} />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}