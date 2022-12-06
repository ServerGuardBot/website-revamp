import { getLanguages, translate, setLanguage, waitForLoad, getCurrentLanguage } from "./translator.jsx";

async function bindLocaleSwitcher() {
    const langs = await getLanguages();
    const curLang = getCurrentLanguage();
    const switcher = document.querySelector("[data-i18n-switcher]");

    switcher.innerHTML = '';
    for (const [index, value] of Object.entries(langs)) {
        var opt = document.createElement('option');
        opt.value = index;
        opt.text = value;
        switcher.append(opt);
    }
    switcher.value = curLang;

    switcher.onchange = (e) => {
        setLanguage(e.target.value).then(() => {
            translateDocument();
        });
    }
}

function translateElement(element) {
    const key = element.getAttribute("data-i18n-key");
    const values = JSON.parse(
        element.getAttribute("data-i18n-opt")
    )
    var translation = translate(key, values);

    element.innerHTML = translation;
}

async function translateDocument() {
    document.querySelectorAll("[data-i18n-key]")
        .forEach(translateElement);
}

document.addEventListener("DOMContentLoaded", () => {
    waitForLoad().then(async function() {
        await translateDocument();
        await bindLocaleSwitcher();
    });
});