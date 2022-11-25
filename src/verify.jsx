const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/
const VERIFY_REGEX = /\/verify\/([\w\-_]+)/
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
});

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import escapeHTML from 'escape-html-tags';

const theme = createTheme({
    palette: {
        primary: {
            main: "#FFED47"
        }
    }
});

function setCookie(name,value,days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/"
}
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

function generateID(l) {
    var r = ''
    var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var cL = c.length
    for ( var i = 0; i < l; i++ ) {
      r += c.charAt(Math.floor(Math.random() * 
 cL))
   }
   return r
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

async function generateBody() {
    var a = await checkVPN()
    var b = getCookie('b')
    if (b == null) {
        b = window.localStorage.getItem('b')
    }

    if (b == null) {
        b = generateID(60)
        setCookie('b', b, 30 * 6)
    }
    if (window.localStorage.getItem('b') == null) {
        window.localStorage.setItem('b', b)
    }
    if (getCookie('b') == null) {
        setCookie('b', b, 30 * 6)
    }
    setCookie('a', (a == true) ? '1' : '0', 30)
    return {
        'v': (a == true) ? '1' : '0',
        'bi': b
    }
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp)
    }
    xmlHttp.open("GET", theUrl, true) // true for asynchronous 
    xmlHttp.send(null)
}

function httpPostAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp)
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'application/json')
    xmlHttp.send(JSON.stringify(data))
}

class VerifyApp extends Component {
    constructor(props) {
        const re = new RegExp(VERIFY_REGEX);
        var window_code = re.exec(window.location.href);
        var code;
        if (window_code !== null) {
            code = window_code[1];
        } else {
            code = params.code;
        }

        super(props);
        this.state = {
            loading: code !== null,
            awaitingServer: false,
            avatar: "https://img.guildedcdn.com/asset/Default/Gil-md.png",
            error: code == null,
            error_message: (code == null) ? "Missing verification code" : "",
            username: "",
            server: "",
            success: false,
            admin_contact: "",
            "code": code
        };

        this.particlesInit = this.particlesInit.bind(this);
        this.identityReceived = this.identityReceived.bind(this);
        this.serverResponse = this.serverResponse.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);

        if (code != null) {
            httpGetAsync(API_BASE_URL + 'verify/' + code, this.identityReceived);
        }
    }

    async particlesInit(engine) {
        await loadLinksPreset(engine);
    }

    async identityReceived(request) {
        if (request.status == 200) {
            var userInfo = JSON.parse(request.responseText);
            this.setState({
                loading: false,
                avatar: userInfo.user_avatar,
                username: userInfo.user_name,
                server: userInfo.guild_name,
                admin_contact: userInfo.admin_contact,
            })
        } else {
            if (typeof request.responseText == "string") {
                this.setState({
                    loading: false,
                    error: true,
                    error_message: `[${request.status}] ${request.responseText}`
                });
            } else {
                this.setState({
                    loading: false,
                    error: true,
                    error_message: `[${request.status}] ${JSON.parse(request.responseText).message}`
                });
            }
        }
    }

    async serverResponse(request) {
        if (request.status == 200) {
            this.setState({
                awaitingServer: false,
                success: true
            });
        }
        else if (request.status >= 500 && request.status < 600) { // Server error
            this.setState({
                awaitingServer: false,
                error: true,
                error_message: `[500] Failed to verify due to a server error, if you continue receiving this message please report it in our <a href="https://serverguard.xyz/support">Support Server</a>`
            });
        } else {
            this.setState({
                awaitingServer: false,
                error: true,
                error_message: `[${request.status}] ${JSON.parse(request.responseText).message}`
            });
        }
    }

    async buttonClicked() {
        if (this.state.loading || this.state.awaitingServer) {
            return
        }

        this.setState({
            awaitingServer: true
        });

        httpPostAsync(API_BASE_URL + 'verify/' + this.state.code, await generateBody(), this.serverResponse);
    }

    render() {
        const loaderStyle = {
            display: (this.state.loading == true || this.state.awaitingServer == true) ? 'unset' : 'none'
        };

        const btnStyle = {
            display: (this.state.loading == false && this.state.awaitingServer == false && this.state.error == false && this.state.success == false) ? 'unset' : 'none'
        }

        const msgStyle = {
            "margin": (this.state.loading == false && this.state.awaitingServer == false && this.state.error == false && this.state.success == false) ? null : '0'
        }

        var headerMessage = "";
        var bodyMessage = "";

        if (this.state.loading) {
            headerMessage = "Loading...";
        } else {
            if (this.state.error) {
                headerMessage = "Error";
                if (this.state.admin_contact !== "" && this.state.admin_contact !== null) {
                    bodyMessage = `${this.state.error_message}<br><br>If you believe this was in error, contact a staff member via <a href="${escapeHTML(this.state.admin_contact)}">this url.</a>`;
                } else {
                    bodyMessage = this.state.error_message;
                }
            }
            else if (this.state.awaitingServer) {
                bodyMessage = "";
            }
            else if (this.state.success) {
                bodyMessage = 'Thanks for verifying, you can now enter the server!'
            } else {
                bodyMessage = `Welcome to ${this.state.server}! This server is protected by Server Guard, please verify with us by clicking the button below.`;
            }

            if (this.state.error === false) {
                headerMessage = `Hello, ${this.state.username}`;
            }
        }

        const options = {
            preset: "links",
            fpsLimit: 60,
            background: {
                color: "#252525"
            },
            particles: {
                color: {
                    value: ["#FFED47"]
                },
                links: {
                    color: "#FFED47"
                },
                move: {
                    speed: .5
                },
                number: {
                    value: 180,
                }
            }
        };

        return (
            <ThemeProvider theme={theme}>
                <div className="app">
                    <div className="particle-container">
                    <Particles options={options} className="verify-particles"
                        init={this.particlesInit}/>
                    </div>
                    <div className="verify">
                        <div className="container header">
                            <img src={this.state.avatar} alt="user avatar icon" className="avatar" />
                            <h1 className="title">{headerMessage}</h1>
                        </div>
                        <div className="container body">
                            <p className="message" style={msgStyle} dangerouslySetInnerHTML={{__html: bodyMessage}}></p>
                            <CircularProgress color="primary" style={loaderStyle} thickness={2} size="3.5rem" />
                            <button className="verify-btn" style={btnStyle} onClick={this.buttonClicked}>Verify</button>
                        </div>
                        <div className="container legal">
                            <p>By verifying with Server Guard, you agree with our <a href="https://serverguard.xyz/legal">Privacy Policy & Terms and Conditions.</a></p>
                            <p>Server Guard is not endorsed or created by Guilded</p>
                        </div>
                    </div>
                </div>
            </ThemeProvider>
        )
    }
}

ReactDOM.render(<VerifyApp />, document.getElementById('app'));