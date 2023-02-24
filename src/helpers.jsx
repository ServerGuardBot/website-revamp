export var API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/;

if (location.hostname == 'localhost') {
    API_BASE_URL = "http://localhost:5000/" // http://localhost:5000/ // https://api.serverguard.xyz/
}

export function isValidURL(string) {
    var res = 
        string.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
    return (res !== null);
};

export function generateChannels(channels, allowedTypes) {
    var channelsList = [];

    if (channels !== null && channels !== undefined) {
        for (const [id, channel] of Object.entries(channels)) {
            if (allowedTypes !== undefined && allowedTypes.indexOf(channel.type) == -1) {
                continue // Not an allowed channel type
            }
            channelsList.push({
                label: channel.name,
                value: id,
            });
        }
        return channelsList;
    }
    return []
}

export function generateRoles(roles) {
    var rolesList = [];

    if (roles !== null && roles !== undefined) {
        for (const [id, role] of Object.entries(roles)) {
            rolesList.push({
                label: role.name,
                value: id,
            });
        }
        return rolesList;
    }
    return [];
}