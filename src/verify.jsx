const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/
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
import CryptoJS from 'crypto-js';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { translateAsync, translate, waitForLoad } from "./translator.jsx";

const theme = createTheme({
    palette: {
        primary: {
            main: "#FFED47"
        }
    }
});

const key = CryptoJS.enc.Utf8.parse(SECRET);

function setCookie(name,value,days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + ";domain=.serverguard.xyz;path=/"
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
    var a = await checkVPN();
    var b = getCookie('b');
    if (b == null) {
        b = window.localStorage.getItem('b');
    }

    if (b == null) {
        const fpPromise = await FingerprintJS.load();
        var fpRes = await fpPromise.get();
        b = fpRes.visitorId; //generateID(60);
        setCookie('b', b, 30 * 6);
    }
    if (window.localStorage.getItem('b') == null) {
        window.localStorage.setItem('b', b);
    }
    if (getCookie('b') == null) {
        setCookie('b', b, 30 * 6);
    }
    setCookie('a', (a == true) ? '1' : '0', 30)
    return CryptoJS.AES.encrypt(JSON.stringify({
        'v': (a == true) ? '1' : '0',
        'bi': b
    }), key, {mode: CryptoJS.mode.ECB}).toString();
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function httpPostAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'text/plain'); // application/json
    xmlHttp.send(data);
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
            "code": code,
            translationsReady: false,
        };

        this.particlesInit = this.particlesInit.bind(this);
        this.identityReceived = this.identityReceived.bind(this);
        this.serverResponse = this.serverResponse.bind(this);
        this.buttonClicked = this.buttonClicked.bind(this);

        waitForLoad().then((() => {
            this.setState({
                translationsReady: true,
                error_message: (code == null) ? translate('verify.missingcode') : ""
            });
            if (code != null) {
                history.replaceState({}, '', `${location.origin}/verify/${code}`);
                httpGetAsync(API_BASE_URL + 'verify/' + code, this.identityReceived);
            }
        }).bind(this));
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
                    error_message: await translateAsync(`verify.${request.status}.${JSON.parse(request.responseText).message}`) | `[${request.status}] ${request.responseText}`
                });
            } else {
                this.setState({
                    loading: false,
                    error: true,
                    error_message: await translateAsync(`verify.${request.status}.${JSON.parse(request.responseText).message}`) | `[${request.status}] ${JSON.parse(request.responseText).message}`
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
                error_message: await translateAsync(`verify.500`) | `[500] Failed to verify due to a server error, if you continue receiving this message please report it in our <a href="https://serverguard.xyz/support">Support Server</a>`
            });
        } else {
            this.setState({
                awaitingServer: false,
                error: true,
                error_message: await translateAsync(`verify.${request.status}.${JSON.parse(request.responseText).message}`) || `[${request.status}] ${JSON.parse(request.responseText).message}`
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

        if (this.state.translationsReady) {
            if (this.state.loading) {
                headerMessage = translate('verify.loading');
            } else {
                if (this.state.error) {
                    headerMessage = translate('verify.error');
                    if (this.state.admin_contact !== "" && this.state.admin_contact !== null) {
                        bodyMessage = translate('verify.failure.with_contact', {
                            message: this.state.error_message,
                            admin_contact: escapeHTML(this.state.admin_contact)
                        });
                    } else {
                        bodyMessage = this.state.error_message;
                    }
                }
                else if (this.state.awaitingServer) {
                    bodyMessage = "";
                }
                else if (this.state.success) {
                    bodyMessage = translate('verify.message.success');
                } else {
                    bodyMessage = translate('verify.message.intro', {
                        server: this.state.server
                    });
                }
    
                if (this.state.error === false) {
                    headerMessage = translate('verify.welcome', {
                        username: this.state.username
                    });
                }
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
                {
                function() {
                    if (this.state.translationsReady == false) {
                        return (
                            <div className="loading">
                                <CircularProgress color="primary" thickness={3} size="3.8rem" />
                            </div>
                        )
                    }
                    return (<div className="app">
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
                                <button className="verify-btn" style={btnStyle} onClick={this.buttonClicked}>{translate('verify.button')}</button>
                            </div>
                            <div className="container warning">
                                <span class="material-symbols-outlined icon">warning</span>
                                <p>{translate('verify.scamwarning')}</p>
                            </div>
                            <div className="container legal">
                                <p dangerouslySetInnerHTML={
                                    {__html: translate('verify.legal')}
                                }></p>
                                <p>{translate('verify.notice')}</p>
                            </div>
                        </div>
                    </div>)
                    }.bind(this)()
                }
            </ThemeProvider>
        )
    }
}

ReactDOM.render(<VerifyApp />, document.getElementById('app'));