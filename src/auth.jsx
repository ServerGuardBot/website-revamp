import { API_BASE_URL } from "./helpers.jsx"

export function setCookie(name,value,days) {
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

export async function authenticated_get(url, noRedirect) {
    return new Promise(async function(resolve, reject) {
        httpGetAsync(url, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_get(url));
                } else {
                    if (!noRedirect) {
                        location.assign(`${location.origin}/login`);
                    }
                    reject();
                }
            } else {
                resolve(request);
            }
        });
    });
}

export async function authenticated_post(url, data, noRedirect) {
    return new Promise(async function(resolve, reject) {
        httpPostAsync(url, data, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_post(url, data));
                } else {
                    if (!noRedirect) {
                        location.assign(`${location.origin}/login`);
                    }
                    reject();
                }
            } else {
                resolve(request);
            }
        });
    });
}

export async function authenticated_patch(url, data, noRedirect) {
    return new Promise(async function(resolve, reject) {
        httpPatchAsync(url, data, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_patch(url, data));
                } else {
                    if (!noRedirect) {
                        location.assign(`${location.origin}/login`);
                    }
                    reject();
                }
            } else {
                resolve(request);
            }
        });
    });
}

export async function authenticated_delete(url, data, noRedirect) {
    return new Promise(async function(resolve, reject) {
        httpDeleteAsync(url, data, async function(request) {
            if (request.status == 403) {
                var success = await refresh_token();
                if (success) {
                    resolve(await authenticated_delete(url, data));
                } else {
                    if (!noRedirect) {
                        location.assign(`${location.origin}/login`);
                    }
                    reject();
                }
            } else {
                resolve(request);
            }
        });
    });
}

export async function get_user(noRedirect) {
    return new Promise(async function(resolve, reject) {
        try {
            authenticated_get(API_BASE_URL + 'auth', noRedirect)
                .then(async (request) => {
                    if (request.status == 200) {
                        const txt = await request.text();
                        resolve(JSON.parse(txt));
                    } else {
                        resolve(0); // Resolve to null as it didn't redirect, the calling function would expect this and handle it appropriately
                    }
                })
                .catch(() => {
                    resolve(0); // Resolve to null as it didn't redirect, the calling function would expect this and handle it appropriately
                });
        } catch {
            resolve(0); // Resolve to null as it didn't redirect, the calling function would expect this and handle it appropriately
        }
    });
}