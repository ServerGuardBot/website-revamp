const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Particles from "react-tsparticles";
import { loadLinksPreset } from "tsparticles-preset-links";

function setCookie(name,value,days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + ";HttpOnly;Secure;domain=.serverguard.xyz;path=/"
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

class LoginApp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            "code": null,
        };

        this.particlesInit = this.particlesInit.bind(this);
        this.codeReceived = this.codeReceived.bind(this);
        this.codeStatusReceived = this.codeStatusReceived.bind(this);
        this.loop = this.loop.bind(this);

        httpPostAsync(API_BASE_URL + 'auth', "", this.codeReceived);

        window.setInterval(this.loop, 1000);
    }

    async loop() {
        if (this.state.code != null) {
            httpGetAsync(API_BASE_URL + `auth/status/${this.state.code}`, this.codeStatusReceived);
        }
    }

    async particlesInit(engine) {
        await loadLinksPreset(engine);
    }

    async codeReceived(request) {
        if (request.status == 403) {
            location.assign(`${location.origin}/account`); // Already logged in, redirect to account page
        } else if (request.status == 200) {
            this.setState({
                "code": JSON.parse(request.responseText).code
            });
        }
    }

    async codeStatusReceived(request) {
        if (request.status == 404) {
            this.setState({
                "code": null
            })
            httpPostAsync(API_BASE_URL + 'auth', "", this.codeReceived);
        }
        else if (request.status == 200) {
            const msg = JSON.parse(request.responseText);
            setCookie('auth', msg.auth, 1);
            setCookie('refresh', msg.refresh, 14);
            location.assign(`${location.origin}/account`)
        }
    }

    render() {
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
            <div className="app">
                <div className="particle-container">
                    <Particles options={options} className="verify-particles"
                    init={this.particlesInit}/>
                </div>
                <div className="login">
                    <div className="container">
                        <h1>{(this.state.code == null) ? "Waiting for Code..." : this.state.code}</h1>
                        <p>Send this code in <a target="_blank" href="https://www.guilded.gg/server-guard/groups/D57rgP7z/channels/1f6fae7f-6cdf-403d-80b9-623a76f8b621/chat">#Login</a> in our support server to log in!</p>
                        <p>Please keep this page open until you have sent the code, it will automatically redirect to the account page once logged in.</p>
                    </div>
                </div>
            </div>
        )
    }
}

ReactDOM.render(<LoginApp />, document.getElementById('app'));