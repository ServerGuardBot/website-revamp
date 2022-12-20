import React, { Component } from 'react';
import { useLoaderData, Route, Routes } from "react-router-dom";
import { Navigation, NavChoice, ServerNavigation } from "./dashboard.jsx";

const withHooks = () => {
    return (props) => {
        const server = useLoaderData();

        return <Servers server={server} {...props}/>;
    }
}

const paths = {
    'Dashboard': '/',
    'Verification': '/verification',
    'Logging': '/logs',
    'XP Management': '/xp',
    'Chat Filters': '/filters',
    'Word Blacklist': '/blacklist',
    'Welcomer': '/welcomer',
    'Conversation Starter': '/conversation',
    'Giveaways': '/giveaways'
}

class Dash extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var user = this.props.user;
        var server = this.props.server;
        return (
            <div className="server-dash">
                test
            </div>
        )
    }
}

class Servers extends Component {
    constructor(props) {
        super(props);
        
        const re = new RegExp(/account\/servers\/\w+\/(\w+)/);
        const found = location.pathname.match(re);

        this.defaultSelected = 'Dashboard';
        if (found !== null) {
            const testCase = `/${found[1]}`;
            for (const [name, element] of Object.entries(paths)) {
                if (element.toLowerCase() == testCase.toLowerCase()) {
                    this.defaultSelected = name;
                    break
                }
            }
        }

        this.navigatedTo = this.navigatedTo.bind(this);
    }

    navigatedTo(tab) {
        console.log('NAVIGATING TO', tab);
    }

    render() {
        document.body.classList.add('cover-screen');
        document.body.parentNode.scroll(0, 0);
        var user = this.props.user;
        var server = this.props.server;
        return (
            <div className="server-config">
                <ServerNavigation user={user} server={server} />
                <Navigation itemSelected={this.navigatedTo} default={this.defaultSelected} server={server} choices={{
                    Dashboard: new NavChoice('home', false, `/servers/${server.id}/`),
                    Moderation: {
                        Verification: new NavChoice('flag', false, `/servers/${server.id}/verification`),
                        Logging: new NavChoice('list', false, `/servers/${server.id}/logs`),
                        'XP Management': new NavChoice('plus_one', false, `/servers/${server.id}/xp`)
                    },
                    Automod: {
                        'Chat Filters': new NavChoice('chat_bubble', false, `/servers/${server.id}/filters`),
                        'Word Blacklist': new NavChoice('block', false, `/servers/${server.id}/blacklist`)
                    },
                    General: {
                        Welcomer: new NavChoice('inbox', false, `/servers/${server.id}/welcomer`),
                        'Conversation Starter': new NavChoice('chat', true, `/servers/${server.id}/conversation`),
                        Giveaways: new NavChoice('redeem', true, `/servers/${server.id}/giveaways`)
                    }
                }}/>
                <div className="server-page">
                    <Routes>
                        <Route exact path='/' element={<Dash user={user} server={server} />} />
                    </Routes>
                </div>
            </div>
        )
    }
}

export default withHooks();