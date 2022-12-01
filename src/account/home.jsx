import React, { Component } from 'react';

class Server extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var data = this.props.data;
        return (
            <div className={`server ${(data.active) ? 'enabled' : 'disabled'}`}>
                <img src={(data.avatar != null) ? data.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} alt={`${data.name} Server Icon`} className="icon" />
                <p>{data.name}</p>
            </div>
        )
    }
}

export default class Home extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        var user = this.props.user;
        return (
            <div className="home">
                <div className="branding-container">
                    <a href="/">
                        <div className="branding">
                            <img src="../images/logo.svg" alt="logo" className="logo" />
                            <h1>SERVER GUARD</h1>
                        </div>
                    </a>
                </div>
                <div className="welcome">
                    <div className="welcome-container">
                        <img src={user.avatar} alt="User Avatar" className="avatar" />
                        <h1>Hello, {user.name}</h1>
                    </div>
                </div>
                <h1 className="servers">My Servers</h1>
                <div className="server-list">
                    {
                        user.guilds.map((guild, index) => <Server data={guild} />)
                    }
                </div>
            </div>
        )
    }
}