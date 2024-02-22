"use client";
import { Paper } from "@mantine/core";
import classes from "./page.module.css";

export default function Page({ params: { serverId } }: { params: { serverId: string } }) {
  return (
    <div className={classes.main}>
      <Paper px="md" py="xs" withBorder>
        Server Loaded
      </Paper>
    </div>
  );
}
