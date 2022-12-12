import React, { Component } from 'react';
import { LineChart } from './charts.jsx';
import { authenticated_get } from '../auth.jsx';

export default class BotAnalytics extends Component {
    constructor(props) {
        super(props);

        if (location.hostname == 'localhost') {
            this.state = {
                largestServers: [
                    {
                        "id": "wReb5DPl",
                        "name": "Anime Island",
                        "avatar": "https://img.guildedcdn.com/TeamAvatar/69b8eb93831c23058e97f213ffef8837-Large.png?w=450&h=450",
                        "members": 14794
                    }
                ],
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
                ],
                userCount: [
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
                ],
                logs: [
                    {
                        "time": 1669791600,
                        "type": "DEBUG",
                        "subject": "guilded.client",
                        "message": "Sending heartbeat"
                    }
                ]
            }
        } else {
            this.state = {
                largestServers: [
                    {
                        "id": "wReb5DPl",
                        "name": "Anime Island",
                        "avatar": "https://img.guildedcdn.com/TeamAvatar/69b8eb93831c23058e97f213ffef8837-Large.png?w=450&h=450",
                        "members": 14794
                    }
                ],
                serverCount: [
                    {
                        "time": 1669791600,
                        "value": 54
                    }
                ],
                userCount: [
                    {
                        "time": 1669791600,
                        "value": 54
                    }
                ],
                logs: [
                    {
                        "time": 1669791600,
                        "type": "DEBUG",
                        "subject": "guilded.client",
                        "message": "Sending heartbeat"
                    }
                ]
            }
    
            authenticated_get('https://api.serverguard.xyz/analytics/servers/dash/2')
                .then(async function(request) {
                    var resp = JSON.parse(request.responseText);
                    this.setState({
                        serverCount: resp.servers,
                        largestServers: (resp.largestServers != undefined) ? resp.largestServers : this.state.largestServers,
                        userCount: (resp.users != undefined) ? resp.users : this.state.userCount
                    });
                }.bind(this))
        }
    }

    render() {
        function logsRenderer(index) {
            const item = this.state.logs[index];
            console.log(index, item);
            return <p className={`log-item ${item.type.toLowerCase()}`}>
                {"["}
                <p className="date">{(new Date(item.time * 1000)).toLocaleString()}</p>
                {" - "}
                <p className="subject">{item.subject}</p>
                {"]: "}
                <p className="message">{item.message}</p>
            </p>
        }
        logsRenderer = logsRenderer.bind(this);
        return (
            <div className="bot-analytics">
                <div className="row">
                    <div className="container data-container">
                        <h1>Server Count</h1>
                        <LineChart
                            width="350"
                            height="150"
                            labels={this.state.serverCount.map((item, _) => {
                                return (new Date(item.time * 1000)).toLocaleString();
                            })}
                            data={[
                            {
                                label: "Servers",
                                data: this.state.serverCount.map((item, _) => {
                                    return {
                                        x: (new Date(item.time * 1000)).toLocaleString(),
                                        y: item.value
                                    }
                                })
                            }
                        ]} />
                    </div>
                    <div className="container data-container">
                        <h1>User Count</h1>
                        <LineChart
                            width="350"
                            height="150"
                            labels={this.state.serverCount.map((item, _) => {
                                return (new Date(item.time * 1000)).toLocaleString();
                            })}
                            data={[
                            {
                                label: "Users",
                                data: this.state.userCount.map((item, _) => {
                                    return {
                                        x: (new Date(item.time * 1000)).toLocaleString(),
                                        y: item.value
                                    }
                                })
                            }
                        ]} />
                    </div>
                </div>
                <div className="row">
                    <div className="container servers">
                        <h1>Largest Servers</h1>
                        {
                            this.state.largestServers.map((item, _) => {
                                return <div className="listed-server">
                                    <img src={(item.avatar != null) ? item.avatar : "https://img.guildedcdn.com/asset/DefaultUserAvatars/profile_1.png"} alt={`${item.name}'s Icon`} className="icon" />
                                    <div className="column">
                                        <p>{item.name}</p>
                                        <p className="members">{item.members} Members</p>
                                    </div>
                                </div>
                            })
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="container logs">
                        <h1>Logs</h1>
                    </div>
                </div>
            </div>
        )
    }
}