export var API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/;

if (location.hostname == 'localhost') {
    API_BASE_URL = "http://localhost:5000/" // http://localhost:5000/ // https://api.serverguard.xyz/
}

export function isValidURL(string) {
    var res = 
        string.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
    return (res !== null);
};

export function generateChannels(channels, allowedTypes, noDisabled) {
    if (noDisabled) {
        var channelsList = [];
    } else {
        var channelsList = [
            {
                label: 'Disabled',
                value: '',
            },
        ];
    }

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
    }
    return channelsList;
}

export function generateRoles(roles) {
    var rolesList = [
        {
            label: 'Disabled',
            value: 0,
        },
    ];

    if (roles !== null && roles !== undefined) {
        for (const [id, role] of Object.entries(roles)) {
            rolesList.push({
                label: role.name,
                value: id,
            });
        }
    }
    return rolesList;
}

function httpGetAsync(theUrl, callback)
{
    fetch(theUrl, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
    })
        .then((response) => {
            callback(response);
        });
}

function httpPostAsync(theUrl, data, callback)
{
    fetch(theUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            callback(response);
        });
}

function httpPostTextAsync(theUrl, data, callback)
{
    fetch(theUrl, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data,
        headers: {
            'Content-Type': 'text/plain',
        },
    })
        .then((response) => {
            callback(response);
        });
}

function httpPatchAsync(theUrl, data, callback)
{
    fetch(theUrl, {
        method: 'PATCH',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data,
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then((response) => {
            callback(response);
        });
}

export async function http_get(url) {
    return new Promise(async function(resolve, reject) {
        httpGetAsync(url, async function(request) {
            if (request.status == 403) {
                reject(request);
            } else {
                resolve(request);
            }
        });
    });
}

export async function http_post(url, data) {
    return new Promise(async function(resolve, reject) {
        httpPostAsync(url, data, async function(request) {
            if (request.status == 403) {
                reject(request);
            } else {
                resolve(request);
            }
        });
    });
}

export async function http_post_text(url, data) {
    return new Promise(async function(resolve, reject) {
        httpPostTextAsync(url, data, async function(request) {
            if (request.status == 403) {
                reject(request);
            } else {
                resolve(request);
            }
        });
    });
}