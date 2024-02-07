const localeRegex = /^(\/[a-zA-Z]{2}(-[a-zA-Z]{2})?)\//;

export default function trimLocale(url: string) {
    return url.replace(localeRegex, '/');
}