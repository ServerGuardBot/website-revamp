const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

import React, { Component } from 'react';
import { Route, Switch, Link, BrowserRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { get_user } from './auth.jsx';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Home from './account/home.jsx';

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
            user: null
        }

        get_user().then((request) => {
            this.setState({
                user: JSON.parse(request.responseText)
            });
        });
    }

    render() {
        return (
            <ThemeProvider theme={theme}>
                <div className="app">
                    {
                        (this.state.user == null)
                        ?
                        <div className="loading"></div>
                        :
                        <Router>
                            <Switch>
                                <Route path='/'>
                                    <Home user={this.state.user} />
                                </Route>
                            </Switch>
                        </Router>
                    }
                </div>
            </ThemeProvider>
        )
    }
}

ReactDOM.render(<AccountApp />, document.getElementById('app'));