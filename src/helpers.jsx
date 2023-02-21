export var API_BASE_URL = "https://api.serverguard.xyz/" // http://localhost:5000/ // https://api.serverguard.xyz/;

if (location.hostname == 'localhost') {
    API_BASE_URL = "http://localhost:5000/" // http://localhost:5000/ // https://api.serverguard.xyz/
}

export function isValidURL(string) {
    var res = 
        string.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi);
    return (res !== null);
    };