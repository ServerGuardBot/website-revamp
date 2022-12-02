import React, { Component } from 'react';
import { LineChart } from './charts.jsx';
import { authenticated_get } from '../auth.jsx';

export default class BotAnalytics extends Component {
    constructor(props) {
        super(props);

        if (location.hostname == 'localhost') {
            this.state = {
                serverCount: [
                    {
                        "time": 1669791600,
                        "value": 54
                    },
                    {
                        "time": 1669795200,
                        "value": 54
                    },
                    {
                        "time": 1669798800,
                        "value": 54
                    },
                    {
                        "time": 1669802400,
                        "value": 34
                    },
                    {
                        "time": 1669806000,
                        "value": 34
                    },
                    {
                        "time": 1669809600,
                        "value": 35
                    },
                    {
                        "time": 1669813200,
                        "value": 37
                    },
                    {
                        "time": 1669816800,
                        "value": 40
                    },
                    {
                        "time": 1669820400,
                        "value": 41
                    },
                    {
                        "time": 1669824000,
                        "value": 41
                    },
                    {
                        "time": 1669827600,
                        "value": 42
                    },
                    {
                        "time": 1669831200,
                        "value": 42
                    },
                    {
                        "time": 1669834800,
                        "value": 45
                    },
                    {
                        "time": 1669838400,
                        "value": 44
                    },
                    {
                        "time": 1669842000,
                        "value": 44
                    },
                    {
                        "time": 1669845600,
                        "value": 47
                    },
                    {
                        "time": 1669849200,
                        "value": 47
                    },
                    {
                        "time": 1669852800,
                        "value": 48
                    },
                    {
                        "time": 1669856400,
                        "value": 48
                    },
                    {
                        "time": 1669860000,
                        "value": 50
                    },
                    {
                        "time": 1669863600,
                        "value": 52
                    },
                    {
                        "time": 1669867200,
                        "value": 54
                    },
                    {
                        "time": 1669870800,
                        "value": 54
                    },
                    {
                        "time": 1669874400,
                        "value": 54
                    },
                    {
                        "time": 1669878000,
                        "value": 54
                    },
                    {
                        "time": 1669881600,
                        "value": 54
                    },
                    {
                        "time": 1669885200,
                        "value": 55
                    },
                    {
                        "time": 1669888800,
                        "value": 54
                    },
                    {
                        "time": 1669892400,
                        "value": 54
                    },
                    {
                        "time": 1669896000,
                        "value": 54
                    },
                    {
                        "time": 1669899600,
                        "value": 54
                    },
                    {
                        "time": 1669903200,
                        "value": 54
                    },
                    {
                        "time": 1669906800,
                        "value": 54
                    },
                    {
                        "time": 1669910400,
                        "value": 54
                    },
                    {
                        "time": 1669914000,
                        "value": 54
                    },
                    {
                        "time": 1669917600,
                        "value": 54
                    },
                    {
                        "time": 1669921200,
                        "value": 54
                    },
                    {
                        "time": 1669924800,
                        "value": 54
                    },
                    {
                        "time": 1669928400,
                        "value": 57
                    }
                ]
            }
        } else {
            this.state = {
                serverCount: [
                    {
                        "time": 1669791600,
                        "value": 54
                    }
                ]
            }
    
            authenticated_get('https://api.serverguard.xyz/analytics/servers/dash')
                .then(async function(request) {
                    var resp = JSON.parse(request.responseText);
                    this.setState({
                        serverCount: resp.servers
                    });
                }.bind(this))
        }
    }

    render() {
        return (
            <div className="bot_analytics">
                <LineChart labels={this.state.serverCount.map((item, _) => {
                    return (new Date(item.time)).toLocaleString();
                })} data={[
                    {
                        label: "servers",
                        data: this.state.serverCount.map((item, _) => {
                            return {
                                x: (new Date(item.time)).toLocaleString(),
                                y: item.value
                            }
                        })
                    }
                ]} />
            </div>
        )
    }
}