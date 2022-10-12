const API_BASE_URL = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? 'http://localhost:5000/' : 'https://serverguard-api.reapimus.com/'
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop)
})
const code = params.code

const welcome = document.getElementsByClassName('welcome')[0]
const avatar = document.getElementsByClassName('avatar')[0]
const loader = document.getElementsByClassName('loader')[0]
const info = document.getElementsByClassName('info')[0]
const btn = document.getElementById('verify')

function dv() {
    return fetch(`https://ipapi.co/json`)
    .then(function(response) { return response.json() })
    .then(function (data) { 
      var bT = Intl.DateTimeFormat().resolvedOptions().timeZone
      var iT = data.timezone
      return iT != bT
    })
  }

function err(reason) {
    loader.classList.add('hidden')
    btn.classList.add('hidden')
    info.classList.remove('hidden', 'gap')
    welcome.innerText = 'Error'
    info.innerText = reason
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp)
    }
    xmlHttp.open("GET", theUrl, true) // true for asynchronous 
    xmlHttp.send(null)
}

function httpPostAsync(theUrl, data, callback)
{
    var xmlHttp = new XMLHttpRequest()
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp)
    }
    xmlHttp.open("POST", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader('Content-Type', 'application/json')
    xmlHttp.send(JSON.stringify(data))
}

var allow_verification = false

function z(name,value,days) {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/"
}
function x(name) {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for(var i=0;i < ca.length;i++) {
        var c = ca[i]
        while (c.charAt(0)==' ') c = c.substring(1,c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
}

function k(l) {
    var r = ''
    var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var cL = c.length
    for ( var i = 0; i < l; i++ ) {
      r += c.charAt(Math.floor(Math.random() * 
 cL))
   }
   return r
}

async function u() {
    var a = await dv()
    var b = x('b')
    if (b == null) {
        b = window.localStorage.getItem('b')
    }

    if (b == null) {
        b = k(60)
        z('b', b, 30 * 6)
    }
    if (window.localStorage.getItem('b') == null) {
        window.localStorage.setItem('b', b)
    }
    if (x('b') == null) {
        z('b', b, 30 * 6)
    }
    z('a', (a == true) ? '1' : '0', 30)
    return {
        'v': (a == true) ? '1' : '0',
        'bi': b
    }
}

btn.onclick = async function() {
    if (allow_verification) {
        loader.classList.remove('hidden')
        var _ = httpPostAsync(API_BASE_URL + 'verify/' + code, await u(), (verifRequest) => {
            loader.classList.add('hidden')
            btn.classList.add('hidden')
            info.classList.remove('gap')
            if (verifRequest.status == 200) {
                info.innerText = 'All done, welcome to the server!'
            } else {
                info.innerText = 'Failed verification, if you believe this is a mistake please contact a server moderator.'
            }
        })
    }
}

if (code != null) {
    var _ = httpGetAsync(API_BASE_URL + 'verify/' + code, (codeRequest) => {
        if (codeRequest.status == 200) {
            var userInfo = JSON.parse(codeRequest.responseText)
            avatar.src = userInfo.user_avatar
            welcome.innerText = `Hello, ${userInfo.user_name}`
            info.innerText = `Welcome to ${userInfo.guild_name}! This server is protected by Server Guard, please verify with us by clicking the button below.`
            allow_verification = true
            loader.classList.add('hidden')
            info.classList.remove('hidden')
            btn.classList.remove('hidden')
        } else {
            err('Invalid verification code, please generate a new one using /verify')
        }
    })
} else {
    err('Missing verification code')
}