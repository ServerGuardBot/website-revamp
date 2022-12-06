const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

import React, { Component } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { get_user } from './auth.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { waitForLoad } from "./translator.jsx";

import Home from './account/home.jsx';
import BotAnalytics from './account/bot_analytics.jsx';

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
                <Router>
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
                                            <Routes>
                                                <Route path='/account/' element={<Home user={this.state.user} />}/>
                                                <Route path='/account/internal/' element={<BotAnalytics user={this.state.user} />}/>
                                            </Routes>
                                        </div>
                                    )
                                }
                            }.bind(this))()
                        }
                    </div>
                </Router>
            </ThemeProvider>
        )
    }
}

ReactDOM.render(<AccountApp />, document.getElementById('app'));