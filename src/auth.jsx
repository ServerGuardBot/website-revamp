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

function httpDeleteAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = async function() { 
        if (xmlHttp.readyState == 4)
            await callback(xmlHttp);
    }
    xmlHttp.open("DELETE", theUrl, true); // true for asynchronous
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

export async function authenticated_delete(url, data) {
    return new Promise(async function(resolve, reject) {
        httpDeleteAsync(url, data, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_delete(url, data));
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
        var request = await authenticated_get(API_BASE_URL + 'auth');
        if (request.status == 200) {
            resolve(JSON.parse(request.responseText));
        }
    });
}