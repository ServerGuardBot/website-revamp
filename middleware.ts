import { LANGUAGES } from "@/localization/constants";
import createMiddleware from "next-intl/middleware";

const LANG_MATCHER = "/(en|ar|ma|ch|nl|fr|ko|es|de)/:path*"; // can't do this because nextjs is fucking RETARDED. `/(${LANGUAGES.join("|")})/:path*`;
// and they apparently don't support variables either, actual garbage shit.

export default createMiddleware({
  locales: LANGUAGES,
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(en|ar|ma|ch|nl|fr|ko|es|de)/:path*", '/((?!_next|_vercel|.*\\..*).*)'],
};
