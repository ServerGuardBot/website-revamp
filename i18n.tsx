import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { LANGUAGES } from "@/localization/constants";
import TRANSLATION_VALUES from "./localization/defaults";

// Can be imported from a shared config
const locales = LANGUAGES;

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./translations/${locale}.json`)).default,

    defaultTranslationValues: TRANSLATION_VALUES,
  };
});
