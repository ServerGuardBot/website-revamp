import React, { Component } from 'react';
import { LineChart } from './charts.jsx';
import { authenticated_get } from '../auth.jsx';

export default class BotAnalytics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            serverCount: {}
        }

        authenticated_get('https://api.serverguard.xyz/analytics/servers/dash')
            .then(async function(request) {
                var resp = JSON.parse(request.responseText);
                this.setState({
                    serverCount: resp.servers
                });
            }.bind(this))
    }

    render() {
        var servers = this.state.serverCount.map(
            (item, index) => {
                return {
                    x: (new Date(item.time)).toLocaleString(),
                    y: item.value
                }
            }
        );
        return (
            <div className="bot_analytics">
                <LineChart data={[
                    {
                        label: 'hour',
                        data: servers
                    }
                ]} />
            </div>
        )
    }
}