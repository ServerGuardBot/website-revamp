"use client";
import { Title, Text, Button, Container, Group } from '@mantine/core';
import classes from './NotFound.module.css';
import Link from 'next/link';

export function NotFound({ homePage="/" }: { homePage?: string }) {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>You have found a secret place.</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has
        been moved to another URL.
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md" component={Link} href={homePage}>
          Take me back
        </Button>
      </Group>
    </Container>
  );
}