import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { Route, Routes, BrowserRouter } from "react-router-dom";
import {
    createStyles, Drawer, MediaQuery, Header, Title, Burger, ScrollArea, Loader, MantineProvider
} from '@mantine/core';
import {
    IconHome, IconUser, IconServer, IconFlag
} from '@tabler/icons';
import { Navigation, NavChoice } from "./account_pages/dashboard.jsx";
import { useViewportSize } from '@mantine/hooks';
import { NothingFoundBackground } from './nothing_found.jsx';
import { get_user } from './auth.jsx';
import { waitForLoad } from "./translator.jsx";
import { Overview } from './internal_pages/overview.jsx';

const paths = {
    'Overview': '/',
    'FFlags': '/fflags',
    'Users': '/users',
    'Servers': '/servers',
}

const icons = {
    'Overview': IconHome,
    'FFlags': IconFlag,
    'Users': IconUser,
    'Servers': IconServer,
}

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
        backgroundColor: theme.colors.dark[8],
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4,
        borderColor: theme.colors.dark[9],
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

function Internal() {
    const { classes, theme } = useStyles();
    const [defaultSelected, setDefaultSelected] = useState('Overview');
    const [navOpened, setNavOpened] = useState(false);
    const [translationsReady, setTranslationsReady] = useState(false);
    useEffect(() => {
        const re = new RegExp(/internal\/internal\/(\w+)/);
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
            // it's the base route, this is the Overview path.
            setDefaultSelected('Overview');
        }
    }, []);

    const [user, setUser] = useState('');

    var icon = {
        object: icons[defaultSelected] || IconHome
    }

    const { width } = useViewportSize();
    const [screenWidth, setScreenWidth] = useState(width);

    useEffect(() => {
        get_user().then(function(user) {
            if (user.id != 'm6YxwpQd') {
                location.assign(location.origin);
                return
            }
            if (location.hostname == 'localhost') {
                setTimeout(function() {
                    setUser(user);
                }, 1000); // Simulate lag on local tests
            } else {
                setUser(user);
            }
        });
    
        waitForLoad().then(function() {
            setTranslationsReady(true)
        });
    }, []);

    var navItems = (
        <div style={{display: 'flex'}}>
            <Navigation setDefaultSelected={setDefaultSelected} screenWidth={screenWidth} default={defaultSelected} user={user} server={{id: 'aE9Zg6Kj', name: 'Server Guard [Internal]'}} choices={{
                Overview: new NavChoice(IconHome, false, `/`),
                Management: {
                    FFlags: new NavChoice(IconFlag, false, `/internal/fflags`),
                    Users: new NavChoice(IconUser, false, `/internal/users`),
                    Servers: new NavChoice(IconServer, false, `/internal/servers`),
                },
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
                        maxWidth: 300,
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
        <MantineProvider withGlobalStyles withNormalizeCSS theme={ourTheme}>
            <BrowserRouter basename='/internal'>
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
                            (user == '' || !translationsReady) && (
                                <div className={classes.loading}>
                                    <Loader size='xl' variant='dots' />
                                </div>
                            ) || (
                                <ScrollArea.Autosize w="calc(100vw - 300px)" maxHeight='calc(100% - 43px)' scrollbarSize={6} className={classes.pageScroll}>
                                    <div style={{width: "calc(100vw - 300px)"}} className={classes.content}>
                                            <Routes>
                                                <Route exact path='/' element={<Overview user={user} />} />,
                                                <Route path='/*' element={<NothingFoundBackground />} />,
                                            </Routes>
                                    </div>
                                </ScrollArea.Autosize>
                            )
                        }
                    </div>
                </div>
            </BrowserRouter>
        </MantineProvider>
    );
}

ReactDOM.render(<Internal />, document.getElementById('app'));