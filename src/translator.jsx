const LOCALIZATION_BASE = 'https://localization.serverguard.xyz/';
const rtlLngs = [
    'ae',	/* Avestan */
    'ar',   /* 'العربية', Arabic */
    'arc',  /* Aramaic */
    'bcc',  /* 'بلوچی مکرانی', Southern Balochi */
    'bqi',  /* 'بختياري', Bakthiari */
    'ckb',  /* 'Soranî / کوردی', Sorani */
    'dv',   /* Dhivehi */
    'fa',   /* 'فارسی', Persian */
    'glk',  /* 'گیلکی', Gilaki */
    'he',   /* 'עברית', Hebrew */
    'ku',   /* 'Kurdî / كوردی', Kurdish */
    'mzn',  /* 'مازِرونی', Mazanderani */
    'nqo',  /* N'Ko */
    'pnb',  /* 'پنجابی', Western Punjabi */
    'ps',   /* 'پښتو', Pashto, */
    'sd',   /* 'سنڌي', Sindhi */
    'ug',   /* 'Uyghurche / ئۇيغۇرچە', Uyghur */
    'ur',    /* 'اردو', Urdu */
    'yi'    /* 'ייִדיש', Yiddish */
];

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4)
            callback(xmlHttp);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous
    xmlHttp.send(null);
}

var languages = null; // [lang]: "text"
var currentLanguage = "en";
var loaded = false;

var loadedLanguages = {};

httpGetAsync(LOCALIZATION_BASE + 'languages.json', (request) => {
    languages = JSON.parse(request.responseText);

    var storedLang = window.localStorage.getItem("lang");
    if (storedLang == null) {
        storedLang = browserLanguages(true).find(isSupportedLanguage) || "en";
    }
    setLanguage(storedLang).then(function() {
        loaded = true;
    });
});

function isSupportedLanguage(lang) {
    return lang in languages;
}

function browserLanguages(languageCodeOnly = false) {
    return navigator.languages.map((locale) =>
      languageCodeOnly ? locale.split("-")[0] : locale,
    );
}

export async function getLanguages() {
    return new Promise(async function(resolve, reject) {
        while (languages == null)
            await new Promise(resolve => setTimeout(resolve, 100));
        resolve(languages);
    });
}

export async function waitForLoad() {
    return new Promise(async function(resolve, reject) {
        while (loaded == false)
            await new Promise(resolve => setTimeout(resolve, 100));
        await loadLanguage("en"); // Make sure the English language is always loaded.
        resolve();
    });
}

export async function loadLanguage(lang) {
    return new Promise(async function(resolve, reject) {
        if (lang in loadedLanguages) {
            resolve(true);
            return
        }
        const langs = await getLanguages();
        if (lang in langs) {
            httpGetAsync(LOCALIZATION_BASE + `website/${lang}.json`, (request) => {
                if (request.status == 200) {
                    loadedLanguages[lang] = JSON.parse(request.responseText);
                    resolve(true);
                } else {
                    reject(false);
                }
            })
        } else {
            reject(false);
        }
    });
}

export async function setLanguage(lang) {
    return new Promise(async function(resolve, reject) {
        await loadLanguage("en");
        var exists = await loadLanguage(lang);
        if (exists) {
            currentLanguage = lang;
            window.localStorage.setItem("lang", lang);
            document.documentElement.lang = lang;
            document.documentElement.dir = (rtlLngs.includes(lang)) ? 'rtl' : 'ltr'
            resolve();
        } else {
            reject();
        }
    });
}

export function getCurrentLanguage() {
    return currentLanguage;
}

export function translate(key, values) {
    var lang = loadedLanguages[currentLanguage];

    if (values == undefined)
        values = {}
    
    values = Object.assign({}, values, {
        YEAR: (new Date()).getFullYear()
    })

    if (key in lang || key in loadedLanguages.en) {
        return Object.keys(values).reduce(
            (interpolated, item) =>
                interpolated.replace(
                    new RegExp(`{\s*${item}\s*}`, "g"),
                    values[item],
                ),
            (key in lang) ? lang[key] : loadedLanguages.en[key],
        );
    } else {
        console.error(`'${key}' does not exist in '${currentLanguage}'`);
    }
}

// Async variant of translate for where a guarantee is needed that the translation will be there
export function translateAsync(key, values) {
    return new Promise(async function(resolve, reject) {
        await waitForLoad();
        var lang = loadedLanguages[currentLanguage];

        if (values == undefined)
            values = {}
        
        values = Object.assign({}, values, {
            YEAR: (new Date()).getFullYear()
        })

        if (key in lang || key in loadedLanguages.en) {
            resolve(
                Object.keys(values).reduce(
                    (interpolated, item) =>
                        interpolated.replace(
                            new RegExp(`{\s*${item}\s*}`, "g"),
                            values[item],
                        ),
                    (key in lang) ? lang[key] : loadedLanguages.en[key]
                )
            );
        } else {
            console.error(`'${key}' does not exist in '${currentLanguage}'`);
        }
    });
}