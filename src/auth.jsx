const API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/

function setCookie(name,value,days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + ";domain=.serverguard.xyz;path=/"
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = async function() { 
        if (xmlHttp.readyState == 4)
            await callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.withCredentials = true;
    xmlHttp.send(null);
}

function httpPostAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = async function() { 
        if (xmlHttp.readyState == 4)
            await callback(xmlHttp);
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous
    xmlHttp.withCredentials = true;
    xmlHttp.setRequestHeader('Content-Type', 'application/json'); // application/json
    xmlHttp.send(JSON.stringify(data));
}

async function refresh_token() {
    return new Promise(function(resolve, reject) {
        httpPostAsync(API_BASE_URL + 'auth/refresh', {}, function(request) {
            if (request.status == 200) {
                const msg = JSON.parse(request.responseText);
                setCookie('auth', msg.auth, 1);
                setCookie('refresh', msg.refresh, 14);
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export async function authenticated_get(url) {
    return new Promise(async function(resolve, reject) {
        httpGetAsync(url, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_get(url));
                } else {
                    location.assign(`${location.origin}/login`);
                    reject();
                }
            } else {
                resolve(request);
            }
        });
    });
}

export async function authenticated_post(url, data) {
    return new Promise(async function(resolve, reject) {
        httpPostAsync(url, data, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_post(url, data));
                } else {
                    location.assign(`${location.origin}/login`);
                    reject();
                }
            } else {
                resolve(request);
            }
        });
    });
}

export async function get_user() {
    return new Promise(async function(resolve, reject) {
        if (location.hostname == 'localhost') {
            resolve({
                "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/UserAvatar/54aa49d28f35c50b29fbd729b7cf8cdb-Large.webp?w=450&h=450&ia=1",
                "guilds": [
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/f3ca3496e7f2b6bfaeddfbb6526bdec7-Large.png?w=450&h=450",
                        "id": "wlVr3Ggl",
                        "name": "Guilded",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/52c4e8181349da2a3e5b1e0216efe02a-Large.png?w=450&h=450",
                        "id": "kj78xnyR",
                        "name": "Advertisement Space",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/2244e9413e0d3a544afe43a36edc7c87-Large.png?w=450&h=450",
                        "id": "Mldq2n0E",
                        "name": "Programming Space",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/a66e23924a4bc49fbf9242a98d955a7c-Large.png?w=450&h=450",
                        "id": "4R5q39VR",
                        "name": "Guilded-API",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/04ff07e3a8f1f109c4885d25de8d913d-Large.png?w=450&h=450",
                        "id": "QR46qKZE",
                        "name": "Guilded API",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/18634f0a59ccf67b9ef452f5bbf80d5a-Large.png?w=450&h=450",
                        "id": "VRzvL9bR",
                        "name": "Gil Gang",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": true,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/69b8eb93831c23058e97f213ffef8837-Large.png?w=450&h=450",
                        "id": "wReb5DPl",
                        "name": "Anime Island",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/074cfce794aff1ce293dc09dad286043-Large.png?w=450&h=450",
                        "id": "ARmQz4mR",
                        "name": "ReGuilded",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": true,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/4d4f97c75f89c6a82452ff57b6fe1aac-Large.png?w=450&h=450",
                        "id": "QR4MXPdl",
                        "name": "Reapimus",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": null,
                        "id": "wlVq5oYR",
                        "name": "Ambishyon",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/4f28a4ee2dcb05e47b9c632af6bdc6df-Large.png?w=450&h=450",
                        "id": "blPAmevE",
                        "name": "World Builder Game",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/30429367acc757579e1b4c7e6207fee1-Large.png?w=450&h=450",
                        "id": "4l3xGAYE",
                        "name": "Chat About Anime",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/6064af59c15cee519cac3311861432b0-Large.png?w=450&h=450",
                        "id": "4R56dNkl",
                        "name": "Yoki Labs",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/b3079f5148f132c3edd36b82d697b51f-Large.png?w=450&h=450",
                        "id": "4l3r1wyR",
                        "name": "Creation Central",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": false,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/744797641a5a98f7e7341a7e8c9fa918-Large.png?w=450&h=450",
                        "id": "JjMwxb8l",
                        "name": "Parrot Bot",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": true,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/5ee5d209a822d95e565aecfb9644a14e-Large.png?w=450&h=450",
                        "id": "aE9Zg6Kj",
                        "name": "Server Guard",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": true,
                        "avatar": null,
                        "id": "kj7BAwoE",
                        "name": "Reapimus-Test-213asd3",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": true,
                        "avatar": null,
                        "id": "Oj1JY1mR",
                        "name": "Reapimus-test-1234sasd",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    },
                    {
                        "active": true,
                        "avatar": "https://s3-us-west-2.amazonaws.com/www.guilded.gg/TeamAvatar/7316621d358c0d98dfb6e9ecb9ab8b64-Large.png?w=450&h=450",
                        "id": "ME2D3K6R",
                        "name": "Gilded Gamers",
                        "banner": "https://img.guildedcdn.com/TeamBanner/bc59a667d53f406e2b822798229baa79-Hero.png"
                    }
                ],
                "id": "00000000",
                "name": "Test User",
                "premium": "3"
            });
        } else {
            var request = await authenticated_get(API_BASE_URL + 'auth');
            if (request.status == 200) {
                resolve(JSON.parse(request.responseText));
            }
        }
    });
}