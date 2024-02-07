"use client";
import { Loader, Paper } from "@mantine/core";
import classes from "./page.module.css";

export default function Page({ params }: { params: { code: string } }) {
  return (
    <div className={classes.main}>
      <Paper px="md" py="xs" withBorder>
        <Loader type="dots" size="md" />
      </Paper>
    </div>
  );
}
