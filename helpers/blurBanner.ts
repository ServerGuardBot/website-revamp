export default function blurBanner(url: string) {
    return url.replace(/-Hero\.(\w+)/, "-SmallBlurred.jpg");
}