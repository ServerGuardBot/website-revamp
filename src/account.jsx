const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

import React, { Component } from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { get_user } from './auth.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from "@mui/material/styles";

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
            user: ''
        }

        get_user().then(function(user) {
            console.log(user);
            this.setState({
                'user': user
            });
        }.bind(this));
    }

    render() {
        console.log(this.state.user);
        return (
            <ThemeProvider theme={theme}>
                <Router>
                    <div className="app">
                        {
                            (function() {
                                if (this.state.user == '') {
                                    return (
                                        <div className="loading"></div>
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