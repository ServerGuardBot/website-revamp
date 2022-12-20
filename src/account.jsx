const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

import React, { Component } from 'react';
import { Route, createBrowserRouter, RouterProvider, createRoutesFromElements } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { get_user } from './auth.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { waitForLoad } from "./translator.jsx";

import Home from './account/home.jsx';
import BotAnalytics from './account/bot_analytics.jsx';
import Servers from './account/servers.jsx';
import { authenticated_get } from './auth.jsx';

const theme = createTheme({
    palette: {
        primary: {
            main: "#FFED47"
        }
    }
});

class AccountApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            translationsReady: false,
        }

        get_user().then(function(user) {
            if (location.hostname == 'localhost') {
                setTimeout(function() {
                    this.setState({
                        'user': user
                    });
                }.bind(this), 1000); // Simulate lag on local tests
            } else {
                this.setState({
                    'user': user
                });
            }
        }.bind(this));

        waitForLoad().then(function() {
            this.setState({
                translationsReady: true
            })
        }.bind(this));
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="app-account">
                    {
                        (function() {
                            if (this.state.user == '' | this.state.translationsReady == false) {
                                return (
                                    <div className="loading">
                                        <CircularProgress color="primary" thickness={3} size="3.8rem" />
                                    </div>
                                )
                            } else {
                                return (
                                    <div className='account'>
                                        <RouterProvider router={createBrowserRouter(createRoutesFromElements([
                                            <Route path='/' element={<Home user={this.state.user} />}/>,
                                            <Route path='/internal/' element={<BotAnalytics user={this.state.user} />}/>,
                                            <Route
                                                path="/servers/:serverId" 
                                                loader={async ({ params }) => {
                                                    let info;

                                                    for (let index = 0; index < this.state.user.guilds.length; index++) {
                                                        const element = this.state.user.guilds[index];
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
                                                element={<Servers user={this.state.user} />}
                                            />,
                                            <Route
                                                path="/servers/:serverId/*" 
                                                loader={async ({ params }) => {
                                                    let info;

                                                    for (let index = 0; index < this.state.user.guilds.length; index++) {
                                                        const element = this.state.user.guilds[index];
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
                                                element={<Servers user={this.state.user} />}
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
            </ThemeProvider>
        )
    }
}

ReactDOM.render(<AccountApp />, document.getElementById('app'));