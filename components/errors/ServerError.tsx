"use client";
import { Title, Text, Button, Container, Group, Paper } from "@mantine/core";
import classes from "./ServerError.module.css";

export function ServerError({
    reload = () => window.location.reload(),
    error,
    status = 500,
}: {
    reload?: () => void;
    error?: Error & { digest?: string },
    status?: number,
}) {
  return (
    <div className={classes.root}>
      <Container>
        <div className={classes.label}>{status}</div>
        <Title className={classes.title}>Something bad just happened...</Title>
        <Text size="lg" ta="center" className={classes.description}>
          Our servers could not handle your request. Don&apos;t worry, our
          development team was already notified. Try refreshing the page.
        </Text>
        {
            error && (
                <Paper withBorder>
                    {
                        error.digest && (
                            <Text size="lg" ta="center" c="dimmed">{error.digest}</Text>
                        )
                    }
                    <Text size="md" ta="center">{error.message}</Text>
                </Paper>
            )
        }
        <Group justify="center" mt="xs">
          <Button
            variant="white"
            size="md"
            onClick={() => reload()}
          >
            Try again
          </Button>
        </Group>
      </Container>
    </div>
  );
}
