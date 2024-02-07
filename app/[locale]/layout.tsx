import type { Metadata } from "next";
import "./globals.css";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/carousel/styles.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { NextIntlClientProvider, useMessages } from "next-intl";
import TRANSLATION_VALUES from "@/localization/defaults";

const theme = createTheme({
  colors: {
    brand: [
      "#fffedc",
      "#fff8af",
      "#fff37e",
      "#ffee4d",
      "#ffe91e",
      "#e6cf08",
      "#b3a100",
      "#807300",
      "#4d4500",
      "#1b1700",
    ],
  },
  primaryColor: "brand",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Server Guard",
    default: "Server Guard",
  },
  description:
    "A Guilded moderation bot that provides features such as user verification, chat filters & more!",
  keywords:
    "guilded, moderation, bot, server guard, verification, filters, chat",
  openGraph: {
    images: [
      {
        url: "/images/bot-icon.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  return (
    <html lang={locale}>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages} defaultTranslationValues={TRANSLATION_VALUES}>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications />
              {children}
            </ModalsProvider>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
