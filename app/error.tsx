"use client";
import { ServerError } from "@/components/errors/ServerError";
import { useEffect } from "react";
import theme from "@/app/theme";

import "@mantine/notifications/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

export default function Error({
  error,
  reset,
  statusCode,
}: {
  error: Error & { digest?: string };
  reset: () => void;
  statusCode: number;
}) {
  useEffect(() => {
    console.error(error.message);
  }, [error]);

  return (
    <html>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Notifications />
            <ServerError reload={reset} error={error} status={statusCode} />
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
