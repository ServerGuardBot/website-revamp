const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

import React, { useState, useEffect } from 'react';
import { MantineProvider, Loader } from '@mantine/core';
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { get_user } from './auth.jsx';
import { waitForLoad } from "./translator.jsx";

import Home from './account_pages/home.jsx';
import BotAnalytics from './account_pages/bot_analytics.jsx';
import Servers from './account_pages/servers.jsx';

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

function AccountApp() {
    const [user, setUser] = useState('');
    const [translationsReady, setTranslationsReady] = useState(false);

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
            <div className="app-account">
                {
                    (function() {
                        if (user == '' | translationsReady == false) {
                            return (
                                <div className="loading">
                                    <Loader size='xl' variant='dots' />
                                </div>
                            )
                        } else {
                            return (
                                <div className='account'>
                                    <RouterProvider router={createBrowserRouter(createRoutesFromElements([
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
                                        />
                                    ]), {
                                        basename: "/account"
                                    })} />
                                </div>
                            )
                        }
                    }.bind(this))()
                }
            </div>
        </MantineProvider>
    )
}

ReactDOM.render(<AccountApp />, document.getElementById('app'));