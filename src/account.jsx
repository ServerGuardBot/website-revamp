import React, { useState, useEffect } from 'react';
import { createStyles, MantineProvider, Loader, ScrollArea } from '@mantine/core';
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { get_user } from './auth.jsx';
import { waitForLoad } from "./translator.jsx";
import { NothingFoundBackground } from "./nothing_found.jsx";

import Home from './account_pages/home.jsx';
import BotAnalytics from './account_pages/bot_analytics.jsx';
import Servers from './account_pages/servers.jsx';
import { NotificationsProvider } from '@mantine/notifications';
import { API_BASE_URL } from './helpers.jsx';

const theme = {
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

const useStyles = createStyles((theme, _params, getRef) => ({
    app: {
        width: '100vw',
        height: '100vh',
        overflowX: 'hidden',
    },

    content: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
    },

    loading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        width: '100vw',
        height: '100vh',
    },
}));

function AccountApp() {
    const [user, setUser] = useState('');
    const [translationsReady, setTranslationsReady] = useState(false);
    const { classes } = useStyles();

    useEffect(() => {
        get_user().then(function(user) {
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
    }, [])

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <NotificationsProvider limit={5}>
                <div className={classes.app}>
                    {
                        (function() {
                            if (user == '' | translationsReady == false) {
                                return (
                                    <div className={classes.loading}>
                                        <Loader size='xl' variant='dots' />
                                    </div>
                                )
                            } else {
                                return (
                                    <ScrollArea.Autosize maxHeight='100vh' scrollbarSize={6}>
                                        <div className={classes.content}>
                                            <RouterProvider router={createBrowserRouter(createRoutesFromElements([
                                                <Route errorElement={<NothingFoundBackground />} />,
                                                <Route path='/' element={<Home user={user} />}/>,
                                                <Route path='/internal/' element={<BotAnalytics user={user} />}/>,
                                                <Route
                                                    path="/servers/:serverId" 
                                                    loader={async ({ params }) => {
                                                        let info;

                                                        for (let index = 0; index < user.guilds.length; index++) {
                                                            const element = user.guilds[index];
                                                            if (element.id == params.serverId) {
                                                                info = element;
                                                                break
                                                            }
                                                        }

                                                        if (info != null && info != undefined) {
                                                            return info
                                                        } else {
                                                            console.error('INVALID-SERVER');
                                                        }
                                                    }}
                                                    element={<Servers user={user} />}
                                                    errorElement={<NothingFoundBackground />}
                                                />,
                                                <Route
                                                    path="/servers/:serverId/*" 
                                                    loader={async ({ params }) => {
                                                        let info;

                                                        for (let index = 0; index < user.guilds.length; index++) {
                                                            const element = user.guilds[index];
                                                            if (element.id == params.serverId) {
                                                                info = element;
                                                                break
                                                            }
                                                        }

                                                        if (info != null && info != undefined) {
                                                            return info
                                                        } else {
                                                            console.error('INVALID-SERVER');
                                                        }
                                                    }}
                                                    element={<Servers user={user} />}
                                                    errorElement={<NothingFoundBackground />}
                                                />
                                            ]), {
                                                basename: "/account"
                                            })} />
                                        </div>
                                    </ScrollArea.Autosize>
                                )
                            }
                        })()
                    }
                </div>
            </NotificationsProvider>
        </MantineProvider>
    )
}

ReactDOM.render(<AccountApp />, document.getElementById('app'));