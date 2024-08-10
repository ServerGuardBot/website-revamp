import { useState } from "react";
import { UnstyledButton, Checkbox, Text } from "@mantine/core";
import classes from "./CheckboxCard.module.css";

interface CheckboxCardProps {
  title: string;
  description: string;
  value: boolean;
  stateChanged: (state: boolean) => void;
}

export function CheckboxCard({
  title,
  description,
  value,
  stateChanged,
}: CheckboxCardProps) {
  return (
    <UnstyledButton onClick={() => {
        stateChanged(!value);
    }} className={classes.button}>
      <Checkbox
        checked={value}
        onChange={() => {}}
        tabIndex={-1}
        size="md"
        mr="xl"
        styles={{ input: { cursor: "pointer" } }}
        aria-hidden
      />

      <div>
        <Text fw={500} mb={7} lh={1}>
          {title}
        </Text>
        <Text fz="sm" c="dimmed">
          {description}
        </Text>
      </div>
    </UnstyledButton>
  );
}
