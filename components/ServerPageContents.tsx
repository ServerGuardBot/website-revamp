"use client";
import { ServerError } from "./errors/ServerError";
import { Loader, Paper, ScrollArea } from "@mantine/core";
import { NotFound } from "./errors/NotFound";
import { useServer } from "./ServerContext";

import classes from "./ServerPageContents.module.css";

export default function ServerPageContents({
  children,
}: {
  children: React.ReactNode;
}) {
  const server = useServer();

  if (server.status == "loading") {
    return (
      <div className={classes.mainCentered}>
        <Paper px="md" py="xs" withBorder>
          <Loader type="dots" size="md" />
        </Paper>
      </div>
    );
  } else if (server.status == "success") {
    return children;
  } else {
    if (server.error == "not-found") {
      return <div className={classes.mainCentered}>
        <NotFound homePage="/my/account" />
      </div>;
    } else {
      return <div className={classes.mainCentered}>
        <ServerError />
      </div>;
    }
  }
}
