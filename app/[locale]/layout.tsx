import type { Metadata } from "next";
import "./globals.css";

import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";
import { NextIntlClientProvider, useMessages } from "next-intl";
import TRANSLATION_VALUES from "@/localization/defaults";
import { Notifications } from "@mantine/notifications";
import ServiceWorker from "@/components/ServiceWorker";
import { ModalsProvider } from "@mantine/modals";
import { SessionProvider } from "../api/client";
import theme from "@/app/theme";
import { DatesProvider } from "@mantine/dates";

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
        <NextIntlClientProvider
          locale={locale}
          messages={messages}
          defaultTranslationValues={TRANSLATION_VALUES}
        >
          <MantineProvider theme={theme}>
            <DatesProvider
              settings={{}}
            >
              <ModalsProvider>
                <SessionProvider>
                  <Notifications />
                  {children}
                </SessionProvider>
              </ModalsProvider>
            </DatesProvider>
          </MantineProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
