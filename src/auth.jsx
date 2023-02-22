import { API_BASE_URL } from "./helpers.jsx"

function setCookie(name,value,days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    if (location.hostname == 'localhost') {
        document.cookie = name + "=" + (value || "")  + expires + ";.app.localhost;path=/"
    } else {
        document.cookie = name + "=" + (value || "")  + expires + ";domain=.serverguard.xyz;path=/"
    }
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

function httpDeleteAsync(theUrl, data, callback)
{
    fetch(theUrl, {
        method: 'DELETE',
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

async function refresh_token() {
    return new Promise(function(resolve, reject) {
        httpPostAsync(API_BASE_URL + 'auth/refresh', {}, function(request) {
            if (request.status == 200) {
                request.text().then((txt) => {
                    const msg = JSON.parse(txt);
                    setCookie('auth', msg.auth, 1);
                    setCookie('refresh', msg.refresh, 14);
                    resolve(true);
                });
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

export async function authenticated_patch(url, data) {
    return new Promise(async function(resolve, reject) {
        httpPatchAsync(url, data, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_patch(url, data));
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
            const txt = await request.text();
            resolve(JSON.parse(txt));
        }
    });
}